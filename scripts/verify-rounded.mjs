import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");

const OUT = path.resolve("references/verify");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const results = {};

for (const [name, viewport, scale] of [
  ["rounded-desktop", { width: 1440, height: 900 }, 2],
  ["rounded-mobile", { width: 390, height: 844 }, 2],
]) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: scale });
  const page = await context.newPage();
  await page.goto("http://localhost:4455/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
  await page.waitForTimeout(1500);

  const word = page.locator('a[href*="github.com/kirianL"]').first();
  const b = await word.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(3000);

  const note = page.locator(".bio-hand-note--grid");
  const nb = await note.boundingBox();
  const clip = {
    x: Math.max(0, nb.x - 14),
    y: Math.max(0, nb.y - 14),
    width: Math.min(viewport.width, nb.width + 28),
    height: Math.min(viewport.height, nb.height + 28),
  };
  await page.screenshot({ path: path.join(OUT, `${name}.png`), clip });

  const metrics = await page.evaluate(() => {
    const cell = document.querySelector(".gh-grid-cell");
    const d = cell.getAttribute("d");
    const r = cell.getBoundingClientRect();
    return {
      cells: document.querySelectorAll(".gh-grid-cell").length,
      pathStart: d.slice(0, 60),
      hasLine: /\bL\b/.test(d),
      quads: (d.match(/Q/g) || []).length,
      box: { w: Math.round(r.width), h: Math.round(r.height) },
      overflowX: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    };
  });
  results[name] = metrics;
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
