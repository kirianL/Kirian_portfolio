import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "http://localhost:4455";
const OUT = path.resolve("references/verify");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const [route, label] of [["/", "en"], ["/es", "es"]]) {
  // ?tz=Europe/Madrid simulates a Hispanic visitor; captures must still follow the page language.
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + route + "?tz=Europe/Madrid", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const srcs = await page.$$eval("#selected-work img", (imgs) => imgs.map((i) => i.getAttribute("src")));
  const naturalWidths = await page.$$eval("#selected-work img", (imgs) =>
    imgs.map((i) => ({ src: i.getAttribute("src"), w: i.naturalWidth, h: i.naturalHeight })),
  );

  const section = await page.$("#selected-work");
  if (section) {
    await page.evaluate(() => document.querySelector("#selected-work")?.scrollIntoView({ block: "start" }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, `work-${label}.png`) });
  }

  results.push({ route, label, srcs, naturalWidths });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
