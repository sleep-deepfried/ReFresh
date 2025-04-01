import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  ssl: false,
});

// Named export for the GET method
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    // Query the food_trends table
    const query = `
      SELECT id, date_range, year, category, image_src, description, created_at
      FROM public.food_trends
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query);

    // Return the data as JSON
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching food trends:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Internal server error', error: errorMessage },
      { status: 500 }
    );
  }
}
