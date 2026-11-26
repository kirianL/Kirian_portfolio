import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire("C:\\\\Users\\\\Kirian\\\\Desktop\\\\LandingFactory\\\\package.json");
const { chromium } = require("playwright");

const OUT = path.resolve("references/verify");
const browser = await chromium.launch();
const games = [
  { id: "valorant", name: "VALORANT" },
  { id: "fortnite", name: "Fortnite" },
];

for (const game of games) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const start = Date.now() - 42 * 60 * 1000;
  await page.addInitScript(
    ({ gameName, startTs }) => {
      const fake = {
        success: true,
        data: {
          discord_status: "online",
          listening_to_spotify: false,
          activities: [
            { id: gameName.toLowerCase(), name: gameName, type: 0, timestamps: { start: startTs } },
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
    },
    { gameName: game.name, startTs: start },
  );

  await page.goto("http://127.0.0.1:4322/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
  await page.waitForTimeout(1500);

  const cr = page.locator('span[tabindex="0"]').filter({ hasText: "Costa Rica" }).first();
  const b = await cr.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(2500);

  const note = page.locator(".bio-hand-note--costa-rica").first();
  const nb = await note.boundingBox();
  const clip = {
    x: Math.max(0, nb.x - 20),
    y: Math.max(0, nb.y - 20),
    width: nb.width + 40,
    height: nb.height + 40,
  };
  await page.screenshot({ path: path.join(OUT, `cr-${game.id}.png`), clip });
  const text = await note.textContent();
  const iconViewBox = await page.locator(".cr-gaming-line svg").getAttribute("viewBox").catch(() => null);
  console.log(`${game.id.toUpperCase()}: ${JSON.stringify(text)} | iconViewBox=${iconViewBox}`);
  await context.close();
}
await browser.close();
