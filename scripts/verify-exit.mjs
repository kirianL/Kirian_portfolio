import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");

const OUT = path.resolve("references/verify");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await context.newPage();
await page.goto("http://localhost:4455/", { waitUntil: "domcontentloaded" });
await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
await page.waitForTimeout(1500);

const word = page.locator('a[href*="github.com/kirianL"]').first();
const b = await word.boundingBox();
const note = page.locator(".bio-hand-note--grid");
const nb = await note.boundingBox();
const clip = {
  x: Math.max(0, nb.x - 16),
  y: Math.max(0, nb.y - 16),
  width: Math.min(1440, nb.width + 32),
  height: Math.min(900, nb.height + 32),
};

// Enter fully.
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
await page.waitForTimeout(2400);

const before = await page.evaluate(() => {
  const cells = [...document.querySelectorAll(".gh-grid-cell")];
  return {
    lit: cells.filter((c) => Number(getComputedStyle(c).opacity) > 0.5).length,
    filled: cells.filter((c) => Number(getComputedStyle(c).fillOpacity) > 0.9).length,
  };
});

// Move the real pointer away so React's onPointerLeave fires.
await page.mouse.move(120, 120);
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, "exit-700.png"), clip });
await page.waitForTimeout(250);
await page.screenshot({ path: path.join(OUT, "exit-950.png"), clip });
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
await page.waitForTimeout(2400);
await page.mouse.move(120, 120);

const samples = await page.evaluate(async () => {
  const cells = [...document.querySelectorAll(".gh-grid-cell")];
  const out = [];
  const count = () => ({
    lit: cells.filter((c) => Number(getComputedStyle(c).opacity) > 0.5).length,
    filled: cells.filter((c) => Number(getComputedStyle(c).fillOpacity) > 0.9).length,
  });
  const t0 = performance.now();
  for (const t of [0, 150, 350, 600, 900, 1200, 1500, 1800, 2100]) {
    await new Promise((r) => setTimeout(r, Math.max(0, t - (performance.now() - t0))));
    out.push({ t, ...count() });
  }
  return out;
});
samples.unshift({ t: "before", ...before });

console.log(JSON.stringify(samples, null, 2));
await browser.close();
