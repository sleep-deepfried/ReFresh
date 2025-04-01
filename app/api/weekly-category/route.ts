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

const getWeekRange = () => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday start
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday end
  endOfWeek.setHours(23, 59, 59, 999);

  return { start: startOfWeek.toISOString(), end: endOfWeek.toISOString() };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const { start, end } = getWeekRange();

    // Query to count occurrences of each food type
    const query = `
      SELECT food_type, COUNT(*) AS count
      FROM public.food_inventory
      WHERE entry_date BETWEEN $1 AND $2
      GROUP BY food_type
      ORDER BY count DESC;
    `;

    const result = await pool.query(query, [start, end]);

    const categories = result.rows.map(row => ({
      name: row.food_type,
      value: parseInt(row.count, 10), // Ensure it's a number
    }));

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching weekly categories:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
