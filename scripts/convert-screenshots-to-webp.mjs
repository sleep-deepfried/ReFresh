/**
 * Converts hero carousel images in public/screenshots/ to WebP.
 * Supports .png, .jpg, .jpeg (case-insensitive). Writes {name}.webp next to sources.
 *
 * Usage: pnpm screenshots:webp  |  npm run screenshots:webp
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SCREENSHOTS_DIR = path.join(ROOT, "public", "screenshots");

const EXT = /\.(png|jpe?g)$/i;

async function main() {
  let entries;
  try {
    entries = await fs.readdir(SCREENSHOTS_DIR);
  } catch (e) {
    console.error(
      `Missing folder ${path.relative(ROOT, SCREENSHOTS_DIR)}. Create it and add PNG/JPEG screenshots (e.g. 1.jpg … 6.jpg).`,
    );
    process.exit(1);
  }

  const inputs = entries.filter((f) => EXT.test(f) && !f.endsWith(".webp"));
  if (inputs.length === 0) {
    console.log("No PNG/JPEG files found in public/screenshots/ (nothing to convert).");
    return;
  }

  for (const name of inputs.sort()) {
    const inputPath = path.join(SCREENSHOTS_DIR, name);
    const base = name.replace(EXT, "");
    const outPath = path.join(SCREENSHOTS_DIR, `${base}.webp`);

    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outPath);

    const inStat = await fs.stat(inputPath);
    const outStat = await fs.stat(outPath);
    const ratio = ((1 - outStat.size / inStat.size) * 100).toFixed(1);
    console.log(`${name} → ${base}.webp (${inStat.size} → ${outStat.size} bytes, ~${ratio}% smaller)`);
  }

  console.log("\nUpdate landing-screenshots.ts to use .webp paths if not already.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
