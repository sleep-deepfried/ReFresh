import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  ssl: false
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    // Query the recent_activity table
    const query = `
      SELECT id, activity_date, food_category, food_item, quantity
      FROM public.recent_activity
      ORDER BY activity_date DESC
      LIMIT 10;
    `;
    const result = await pool.query(query);

    // Return the data as JSON
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Internal server error', error: errorMessage },
      { status: 500 }
    );
  }
}