// Cuts the photographic parts out of design-reference.png into public/images.
// Run once: npm run crop-assets  (replace any of these later from the admin panel)
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "design-reference.png");
const out = path.join(root, "public", "images");
fs.mkdirSync(out, { recursive: true });

const SCALE = 2; // upscale crops for sharper display on high-DPI phones

async function crop(name, left, top, width, height, { mask, circle } = {}) {
  let img = sharp(src).extract({ left, top, width, height }).ensureAlpha();
  const composites = [];
  if (mask) {
    // Fade out leftover text/graphics: each [maxX, maxY, feather] erases the top-left
    // rectangle (0,0)-(maxX,maxY) with a soft edge.
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        let keep = 1;
        for (const [mx, my, f] of mask) {
          const d = Math.hypot(Math.max(0, x - mx), Math.max(0, y - my));
          keep = Math.min(keep, Math.min(1, d / f));
        }
        const i = (y * info.width + x) * 4 + 3;
        data[i] = Math.round(data[i] * keep);
      }
    }
    img = sharp(data, { raw: info });
  }
  if (circle) {
    const r = Math.min(width, height) / 2;
    composites.push({
      input: Buffer.from(`<svg width="${width}" height="${height}"><circle cx="${width / 2}" cy="${height / 2}" r="${r}" fill="white"/></svg>`),
      blend: "dest-in",
    });
  }
  if (composites.length) img = sharp(await img.composite(composites).png().toBuffer());
  await img
    .resize(width * SCALE, height * SCALE, { kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(out, `${name}.png`));
  console.log("wrote", name);
}

/** Logo: turn the light pink background transparent, keep the dark ink and gold leaf. */
async function logo() {
  const { data, info } = await sharp(src)
    .extract({ left: 70, top: 30, width: 330, height: 98 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i + 3] = Math.max(0, Math.min(255, Math.round(((215 - lum) / 120) * 255)));
  }
  await sharp(data, { raw: info })
    .resize(info.width * SCALE, info.height * SCALE, { kernel: "lanczos3" })
    .png()
    .toFile(path.join(out, "logo.png"));
  console.log("wrote logo");
}

await crop("hero", 330, 0, 539, 712, {
  mask: [
    [120, 340, 30], // tail of the logo, headline and subtitle pill
    [48, 440, 22], // edge of the price badge
  ],
});
await crop("before-after", 393, 843, 452, 205);
await crop("review-1", 22, 1392, 120, 120, { circle: true });
await crop("review-2", 302, 1392, 120, 120, { circle: true });
await crop("review-3", 582, 1392, 120, 120, { circle: true });
await crop("ing-ceramide", 118, 1163, 90, 90, { circle: true });
await crop("ing-arbutin", 278, 1163, 90, 90, { circle: true });
await crop("ing-salicylic", 443, 1163, 90, 90, { circle: true });
await crop("leaf-left", 0, 1140, 70, 160);
await crop("leaf-right", 790, 1240, 79, 150);
await logo();
