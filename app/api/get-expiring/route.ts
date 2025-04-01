import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD || "", // Ensure it's a string
  database: process.env.DATABASE_NAME,
  max: 20,
  ssl:{
    rejectUnauthorized: false,
  },
});

// Function to calculate days until expiration
function calculateDaysToExpiration(bestBefore: Date): string {
  const now = new Date();
  const bestBeforeDate = new Date(bestBefore);
  const timeDiff = bestBeforeDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff <= 0) {
    return 'Expired';
  } else if (daysDiff === 1) {
    return '1 Day Left';
  } else if (daysDiff === 2) {
    return '2 Days Left';
  } else {
    return `${daysDiff} Days Left`;
  }
}

// Named export for the GET method
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    // Query to get items expiring within the next 2 days
    const query = `
      SELECT 
        "inventoryid" as id, 
        food_name as foodname, 
        food_type as foodtype, 
        best_before, 
        quantity
      FROM public.food_inventory
      WHERE best_before <= NOW() + INTERVAL '4 days'
      ORDER BY best_before ASC;
    `;
    const result = await pool.query(query);

    // Transform the result to include expiration text
    const expiringItems = result.rows.map(item => ({
      id: item.id,
      foodname: item.foodname,
      foodtype: item.foodtype,
      expiration: calculateDaysToExpiration(item.best_before),
      quantity: item.quantity
    }));

    // Return the data as JSON
    return NextResponse.json(expiringItems, { status: 200 });
  } catch (error) {
    console.error('Error fetching expiring inventory:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Internal server error', error: errorMessage },
      { status: 500 }
    );
  }
}