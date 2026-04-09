import { NextRequest } from "next/server";
import { createPool } from "@/lib/db-pool";
import { jsonError, jsonSuccess } from "@/lib/api-response";

const pool = createPool();

function normalizeDaysUntilBest(value: unknown): number {
  if (value === undefined || value === null) return 7;
  const n = Math.round(Number(value));
  if (!Number.isFinite(n) || n < 0) return 7;
  return Math.min(365, n);
}

interface BatchItemInput {
  name: string;
  quantity: number;
  food_type?: string;
  confidence?: number;
  /** Days until best_before from scan estimate; insert only, default 7 */
  days_until_best?: number;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "validation", "Invalid JSON body");
  }

  const items = (body as { items?: BatchItemInput[] }).items;
  if (!Array.isArray(items) || items.length === 0) {
    return jsonError(400, "validation", "Expected non-empty array: { items: [...] }");
  }

  const normalized: BatchItemInput[] = [];
  for (const raw of items) {
    if (!raw || typeof raw.name !== "string" || !raw.name.trim()) {
      continue;
    }
    const q = Math.round(Number(raw.quantity));
    if (q <= 0 || q > 9999) {
      continue;
    }
    normalized.push({
      name: raw.name.trim().slice(0, 200),
      quantity: q,
      food_type:
        typeof raw.food_type === "string" && raw.food_type.trim()
          ? raw.food_type.trim().slice(0, 80)
          : "General",
      confidence:
        typeof raw.confidence === "number" && !Number.isNaN(raw.confidence)
          ? Math.min(1, Math.max(0, raw.confidence))
          : 0.5,
      days_until_best: normalizeDaysUntilBest(raw.days_until_best),
    });
  }

  if (normalized.length === 0) {
    return jsonError(400, "validation", "No valid items to insert");
  }

  const client = await pool.connect();
  try {
    let inserted = 0;
    let updated = 0;

    await client.query("BEGIN");
    for (const item of normalized) {
      const existing = await client.query<{ inventoryid: number; quantity: number }>(
        `SELECT "inventoryid", quantity FROM public.food_inventory 
         WHERE LOWER(food_name) = LOWER($1) LIMIT 1`,
        [item.name]
      );

      if (existing.rows.length > 0) {
        const row = existing.rows[0];
        await client.query(
          `UPDATE public.food_inventory 
           SET quantity = quantity + $1, confidence = $2 
           WHERE "inventoryid" = $3`,
          [item.quantity, item.confidence, row.inventoryid]
        );
        updated += 1;
      } else {
        const days = item.days_until_best ?? 7;
        await client.query(
          `INSERT INTO public.food_inventory 
           (food_name, food_type, entry_date, best_before, confidence, quantity)
           VALUES ($1, $2, NOW(), NOW() + ($5 * INTERVAL '1 day'), $3, $4)`,
          [item.name, item.food_type || "General", item.confidence, item.quantity, days]
        );
        inserted += 1;
      }
    }
    await client.query("COMMIT");

    return jsonSuccess({ inserted, updated, total: normalized.length }, 200);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("inventory batch error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return jsonError(500, "database", msg);
  } finally {
    client.release();
  }
}
