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
  ["bio-desktop", { width: 1440, height: 900 }, 2, "/"],
  ["bio-mobile", { width: 390, height: 844 }, 2, "/"],
  ["bio-mobile-es", { width: 390, height: 844 }, 2, "/es"],
]) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: scale });
  const page = await context.newPage();
  await page.goto("http://localhost:4455" + route, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
  await page.waitForTimeout(1200);

  const info = await page.evaluate(() => {
    const el = document.querySelector('a[href*="github.com/kirianL"]');
    const bio = el?.closest("p, div");
    const wordRect = el?.getBoundingClientRect();
    return {
      hasEn: document.body.textContent.includes("feel considered, not flashy"),
      hasEs: document.body.textContent.includes("se sientan cuidados, no llamativos"),
      wordBottom: wordRect ? Math.round(wordRect.bottom) : null,
      scrollH: document.documentElement.scrollHeight,
      vh: window.innerHeight,
      overflowX: Math.round(document.documentElement.scrollWidth - window.innerWidth),
    };
  });

  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  results[name] = info;
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
