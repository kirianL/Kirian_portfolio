import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire("C:\\\\Users\\\\Kirian\\\\Desktop\\\\LandingFactory\\\\package.json");
const { chromium } = require("playwright");

const OUT = path.resolve("references/verify");
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await context.newPage();

const start = Date.now() - (1 * 60 + 42) * 60 * 1000;
console.log("intended start:", start, "now:", Date.now(), "diffMin:", Math.round((Date.now()-start)/60000));
await page.addInitScript((startTs) => {
  const fake = {
    success: true,
    data: {
      discord_status: "online",
      listening_to_spotify: false,
      activities: [
        {
          id: "valorant",
          name: "VALORANT",
          type: 0,
          state: "Competitive - Ascent",
          details: "Rank: Immortal 3",
          timestamps: { start: startTs },
        },
      ],
    },
  };
  const origFetch = window.fetch;
  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : (input && input.url) || "";
    if (url.includes("api.lanyard.rest")) {
      return new Response(JSON.stringify(fake), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return origFetch(input, init);
  };
  (window).__lastLanyardData = fake.data;
}, start);

await page.goto("http://127.0.0.1:4322/", { waitUntil: "domcontentloaded" });
await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
await page.waitForTimeout(1500);

const cr = page.locator('span[tabindex="0"]').filter({ hasText: "Costa Rica" }).first();
const b = await cr.boundingBox();
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
await page.waitForTimeout(1500);

const dbg = await page.evaluate(() => {
  // find the component's gaming state via DOM? Just log note text.
  return document.querySelector(".bio-hand-note--costa-rica")?.textContent;
});
console.log("NOTE TEXT:", JSON.stringify(dbg));

// Inspect what the fetch returned and gamingStart
const info = await page.evaluate(async () => {
  const r = await fetch("https://api.lanyard.rest/v1/users/609201692935847978");
  const j = await r.json();
  const g = j.data.activities[0];
  return { start: g.timestamps.start, now: Date.now(), diffMin: Math.round((Date.now() - g.timestamps.start)/60000) };
});
console.log("LANYARD DEBUG:", JSON.stringify(info));

const note = page.locator(".bio-hand-note--costa-rica").first();
const nb = await note.boundingBox();
const clip = { x: Math.max(0, nb.x - 20), y: Math.max(0, nb.y - 20), width: nb.width + 40, height: nb.height + 40 };
await page.screenshot({ path: path.join(OUT, "cr-valorant.png"), clip });
console.log("saved cr-valorant.png");
await browser.close();
