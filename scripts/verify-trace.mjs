import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");
const OUT = path.resolve("references/verify");
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await context.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto("http://localhost:4455/", { waitUntil: "domcontentloaded" });
await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
await page.waitForTimeout(1200);
const word = page.locator('a[href*="github.com/kirianL"]').first();
const box = await word.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
for (const [t, delay] of [["t700", 700], ["t1000", 300], ["t1300", 300], ["t1800", 500]]) {
  await page.waitForTimeout(delay);
  const note = await page.locator(".bio-hand-note--grid").boundingBox();
  await page.screenshot({ path: path.join(OUT, `trace-${t}.png`), clip: { x: note.x - 20, y: note.y - 20, width: note.width + 40, height: note.height + 40 } });
}
console.log(JSON.stringify({ errors }, null, 2));
await browser.close();
