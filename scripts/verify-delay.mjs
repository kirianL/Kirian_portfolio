import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:4455/", { waitUntil: "domcontentloaded" });
await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
await page.waitForTimeout(1000);
const info = await page.evaluate(() => {
  const g = document.querySelectorAll(".gh-grid-week")[10];
  const c = g?.querySelector(".gh-grid-cell");
  return {
    groupStyle: g?.getAttribute("style"),
    wVar: g ? getComputedStyle(g).getPropertyValue("--w") : null,
    delay: c ? getComputedStyle(c).transitionDelay : null,
    duration: c ? getComputedStyle(c).transitionDuration : null,
  };
});
const word = page.locator('a[href*="github.com/kirianL"]').first();
const box = await word.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
const samples = [];
for (const t of [200, 500, 900, 1200, 1600]) {
  await page.waitForTimeout(t === 200 ? 200 : 300);
  samples.push(await page.evaluate((label) => {
    const cells = document.querySelectorAll(".gh-grid-cell");
    const pick = (i) => getComputedStyle(cells[i]).opacity;
    return { at: label, first: pick(0), mid: pick(180), last: pick(cells.length - 1), label: getComputedStyle(document.querySelector(".gh-grid-label")).opacity };
  }, t));
}
console.log(JSON.stringify({ info, samples }, null, 2));
await browser.close();
