import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
});

// In your app/api/notifications/[id]/route.ts file
export async function PATCH(req: NextRequest) {
  let client;
  try {
    // Extract ID from the URL path
    const id = req.url.split('/').pop();
    const { read } = await req.json();

    client = await pool.connect();
    
    await client.query(
      `UPDATE notifications SET read = $1 WHERE id = $2`,
      [read, id]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}