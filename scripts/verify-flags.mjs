import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:4455/", { waitUntil: "domcontentloaded" });
await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
await page.waitForTimeout(1200);
const word = page.locator('[data-cuelume-hover="tick"]').filter({ has: page.locator(".bio-hand-note", { hasText: "UTC" }) }).first();
const b = await word.boundingBox();
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
await page.waitForTimeout(1800);
const info = await page.evaluate(() => {
  const note = [...document.querySelectorAll(".bio-hand-note")].find((n) => n.textContent.includes("UTC"));
  return {
    noteText: note?.textContent.slice(0, 80),
    svgs: note?.querySelectorAll("svg").length ?? 0,
    visible: note ? getComputedStyle(note).visibility : null,
  };
});
console.log(JSON.stringify({ ...info, errors }, null, 2));
await browser.close();
