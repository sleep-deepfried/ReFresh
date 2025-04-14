import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  ssl: false,
});

export async function GET(req: NextRequest) {
  try {
    // Optional: Add pagination parameters from query string
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit')) || 20;
    const offset = Number(searchParams.get('offset')) || 0;

    const result = await pool.query({
      text: `
        SELECT 
          id, 
          inventoryid, 
          message, 
          created_at::text,
          read
        FROM notifications
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `,
      values: [limit, offset],
      rowMode: 'array', // More efficient for simple data
    });

    // Convert to cleaner response format
    const notifications = result.rows.map(row => ({
      id: row[0],
      inventoryId: row[1],
      message: row[2],
      createdAt: row[3],
      read: row[4]
    }));

    return NextResponse.json(notifications, { 
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500, statusText: 'Failed to fetch notifications' }
    );
  }
}