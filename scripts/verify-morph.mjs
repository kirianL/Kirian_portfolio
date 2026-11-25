import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");
const OUT = path.resolve("references/verify");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:4455/", { waitUntil: "domcontentloaded" });
await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
await page.waitForTimeout(1500);
const b = await page.locator('a[href*="github.com/kirianL"]').first().boundingBox();
const nb = await page.locator(".bio-hand-note--grid").boundingBox();
const clip = { x: nb.x - 14, y: nb.y - 14, width: nb.width + 28, height: nb.height + 28 };
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
await page.waitForTimeout(2600);
await page.mouse.move(120, 120);
const out = await page.evaluate(async () => {
  const cells = [...document.querySelectorAll(".gh-grid-cell")];
  const sample = (i) => {
    const s = getComputedStyle(cells[i]);
    return { t: s.transform, o: +(+s.opacity).toFixed(2) };
  };
  const res = [];
  const t0 = performance.now();
  for (const t of [0, 300, 550, 800, 1100]) {
    await new Promise((r) => setTimeout(r, Math.max(0, t - (performance.now() - t0))));
    res.push({ t, first: sample(0), last: sample(cells.length - 1) });
  }
  return res;
});
console.log(JSON.stringify(out, null, 2));
await browser.close();
