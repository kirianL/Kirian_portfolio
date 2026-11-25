import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");

const OUT = path.resolve("references/verify");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const results = {};

for (const [name, viewport, scale, route] of [
  ["cr-desktop", { width: 1440, height: 900 }, 2, "/"],
  ["cr-mobile", { width: 390, height: 844 }, 2, "/"],
  ["cr-mobile-es", { width: 390, height: 844 }, 2, "/es"],
]) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: scale });
  const page = await context.newPage();
  await page.goto("http://localhost:4455" + route, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-cuelume-hover="tick"]', { state: "visible" });
  await page.waitForTimeout(1200);

  const word = page.locator('[data-cuelume-hover="tick"]').filter({ has: page.locator('.bio-hand-note', { hasText: 'UTC' }) }).first();
  const b = await word.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(1900);

  const note = page.locator('.bio-hand-note').filter({ hasText: 'UTC' }).first();
  const nb = await note.boundingBox();
  const clip = {
    x: Math.max(0, nb.x - 20),
    y: Math.max(0, nb.y - 20),
    width: Math.min(viewport.width, nb.width + 40),
    height: Math.min(viewport.height, nb.height + 40),
  };
  await page.screenshot({ path: path.join(OUT, `${name}.png`), clip });

  const info = await note.evaluate((el) => {
    const spans = [...el.querySelectorAll(":scope > span")];
    return {
      text: el.textContent,
      width: Math.round(el.getBoundingClientRect().width),
      lines: spans.map((s) => ({
        text: s.textContent,
        w: Math.round(s.getBoundingClientRect().width),
        h: Math.round(s.getBoundingClientRect().height),
      })),
    };
  });
  results[name] = info;
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
