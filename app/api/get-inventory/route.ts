import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl:{
    rejectUnauthorized: false,
  },
});

// Named export for the GET method
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    // Query the food_inventory table
    const query = `
      SELECT "inventoryid", food_name, food_type, entry_date, best_before, confidence, quantity
      FROM public.food_inventory;
    `;
    const result = await pool.query(query);

    // Return the data as JSON
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Internal server error', error: errorMessage },
      { status: 500 }
    );
  }
}