import { createRequire } from "node:module";
const require = createRequire("C:\\\\Users\\\\Kirian\\\\Desktop\\\\LandingFactory\\\\package.json");
const { chromium } = require("playwright");
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const start = Date.now() - (1 * 60 + 42) * 60 * 1000;
await page.addInitScript((startTs) => {
  const fake = { success: true, data: { discord_status: "online", listening_to_spotify: false, activities: [{ id: "v", name: "VALORANT", type: 0, timestamps: { start: startTs } }] } };
  window.fetch = async (input) => {
    const url = typeof input === "string" ? input : (input && input.url) || "";
    if (url.includes("api.lanyard.rest")) return new Response(JSON.stringify(fake), { status: 200, headers: { "Content-Type": "application/json" } });
    return fetch(input);
  };
  window.__lastLanyardData = fake.data;
}, start);
await page.goto("http://127.0.0.1:4322/", { waitUntil: "domcontentloaded" });
await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
await page.waitForTimeout(2000);
const cr = page.locator('span[tabindex="0"]').filter({ hasText: "Costa Rica" }).first();
const b = await cr.boundingBox();
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
await page.waitForTimeout(2500);
const dbg = await page.evaluate(() => {
  const note = document.querySelector(".bio-hand-note--costa-rica");
  return { noteText: note?.textContent, hasGaming: !!document.querySelector(".cr-gaming-line"), gamingEls: document.querySelectorAll(".cr-gaming-line").length };
});
console.log(JSON.stringify(dbg, null, 2));
await browser.close();
