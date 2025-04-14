import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  let client;
  try {
    // Verify environment variables
    if (!process.env.DATABASE_HOST || !process.env.DATABASE_NAME) {
      throw new Error("Database configuration is missing");
    }

    client = await pool.connect();
    
    // 1. Fetch all food inventory items
    const result = await client.query<{
      inventoryid: number;  // Changed to number
      food_name: string;
      best_before: Date;
      quantity: number;
      confidence: number;
      entry_date: Date;
    }>(`
      SELECT 
        inventoryid,
        food_name, 
        best_before, 
        quantity, 
        confidence,
        entry_date
      FROM public.food_inventory
      WHERE quantity > 0
    `);

    const today = new Date();
    const notifications: { inventoryid: number; message: string }[] = [];  // Changed to number

    // 2. Generate notifications
    for (const item of result.rows) {
      try {
        const { inventoryid, food_name, best_before, confidence, quantity, entry_date } = item;
        
        // Validate inventoryid (should be number)
        if (typeof inventoryid !== 'number') {
          console.warn('Invalid inventoryid:', inventoryid);
          continue;
        }

        const messages: string[] = [];
        const bestBeforeDate = new Date(best_before);
        const entryDate = new Date(entry_date);
        
        if (isNaN(bestBeforeDate.getTime())) {
          console.warn('Invalid best_before date:', best_before);
          continue;
        }

        const daysToExpire = Math.ceil((bestBeforeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // Notification conditions
        if (daysToExpire >= 0 && daysToExpire <= 3) {
          messages.push(`⚠️ ${food_name} is expiring in ${daysToExpire} day(s).`);
        }

        if (bestBeforeDate < today) {
          messages.push(`🗑️ ${food_name} expired on ${bestBeforeDate.toLocaleDateString()}.`);
        }

        if (quantity <= 2) {
          messages.push(`🛒 Low stock: only ${quantity} ${food_name} left.`);
        }

        if (confidence < 0.6) {
          messages.push(`🤖 Low confidence (${confidence.toFixed(2)}) for ${food_name}. Verify please.`);
        }

        if (entryDate.toDateString() === today.toDateString()) {
          messages.push(`🆕 Added ${food_name} today.`);
        }

        messages.forEach((message) => {
          notifications.push({ 
            inventoryid, 
            message 
          });
        });

      } catch (itemError) {
        console.error('Error processing inventory item:', itemError);
      }
    }

    // 3. Insert notifications with integer inventoryid
    if (notifications.length > 0) {
      await client.query(`
        INSERT INTO notifications 
          (inventoryid, message, read, created_at)
        SELECT 
          id,
          message, 
          false, 
          NOW()
        FROM unnest($1::int[], $2::text[]) AS t(id, message)
      `, [
        notifications.map(n => n.inventoryid),
        notifications.map(n => n.message)
      ]);
    }

    return NextResponse.json({ 
      success: true,
      notifications_created: notifications.length,
      sample_notification: notifications.length > 0 ? notifications[0] : null
    });

  } catch (error) {
    console.error("Endpoint error:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}