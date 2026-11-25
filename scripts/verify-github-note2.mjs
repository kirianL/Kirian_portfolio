import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "http://localhost:4455";
const OUT = path.resolve("references/verify");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const results = {};

async function shot(name, route, viewport, scale) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: scale });
  const page = await context.newPage();
  await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
  await page.waitForTimeout(1500);

  const word = page.locator('a[href*="github.com/kirianL"]').first();
  const box = await word.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(2600);

  const note = await page.locator(".bio-hand-note--grid").boundingBox();
  const metrics = await page.evaluate(() => {
    const n = document.querySelector(".bio-hand-note--grid");
    const w = document.querySelector('a[href*="github.com/kirianL"]');
    const r = n.getBoundingClientRect();
    return {
      placement: w?.dataset.notePlacement ?? null,
      left: Math.round(r.left),
      right: Math.round(r.right),
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      viewport: [window.innerWidth, window.innerHeight],
      overflow: Math.round(Math.max(0, r.right - window.innerWidth)) ,
      cells: document.querySelectorAll(".gh-grid-cell").length,
    };
  });

  const pad = 28;
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    clip: {
      x: Math.max(0, note.x - pad),
      y: Math.max(0, note.y - pad),
      width: Math.min(viewport.width, note.width + pad * 2),
      height: Math.min(viewport.height, note.height + pad * 2),
    },
  });
  await page.screenshot({ path: path.join(OUT, `${name}-full.png`) });

  results[name] = metrics;
  await context.close();
}

await shot("grid-zoom", "/", { width: 1440, height: 900 }, 2);
await shot("grid-tablet", "/", { width: 768, height: 1024 }, 1.5);
await shot("grid-mobile", "/", { width: 390, height: 844 }, 2);

await browser.close();
console.log(JSON.stringify(results, null, 2));
