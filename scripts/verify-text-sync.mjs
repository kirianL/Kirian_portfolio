import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:4455/", { waitUntil: "domcontentloaded" });
await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
await page.waitForTimeout(1500);
const b = await page.locator('a[href*="github.com/kirianL"]').first().boundingBox();
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
await page.waitForTimeout(2500);
await page.mouse.move(120, 120);
const out = await page.evaluate(async () => {
  const head = document.querySelector(".gh-card-head");
  const foot = document.querySelector(".gh-card-foot");
  const cells = [...document.querySelectorAll(".gh-grid-cell")];
  const res = [];
  const t0 = performance.now();
  for (const t of [0, 200, 400, 600, 800, 1000, 1200, 1400, 1600]) {
    await new Promise((r) => setTimeout(r, Math.max(0, t - (performance.now() - t0))));
    const ns = getComputedStyle(document.querySelector(".bio-hand-note--grid"));
    res.push({
      t,
      head: +getComputedStyle(head).opacity,
      foot: +getComputedStyle(foot).opacity,
      cellsLit: cells.filter((c) => +getComputedStyle(c).opacity > 0.5).length,
      note: +ns.opacity,
    });
  }
  return res;
});
console.log(JSON.stringify(out, null, 2));
await browser.close();
