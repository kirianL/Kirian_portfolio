import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "http://localhost:4455";
const OUT = path.resolve("references/verify");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function run(route, label, viewport, hover) {
  const page = await browser.newPage({ viewport });
  await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible", timeout: 20000 });
  await page.waitForTimeout(1800);

  const word = page.locator('a[href*="github.com/kirianL"]').first();
  const box = await word.boundingBox();

  if (hover && box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(2200);
  }

  const metrics = await page.evaluate(() => {
    const scope = document.querySelector(".bio-focus-scope");
    const note = document.querySelector(".bio-hand-note--grid");
    const grid = document.querySelector(".gh-grid");
    const word = document.querySelector('a[href*="github.com/kirianL"]');
    const rect = (el) => (el ? el.getBoundingClientRect().toJSON() : null);
    return {
      scrollHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      scope: rect(scope),
      note: rect(note),
      grid: rect(grid),
      word: rect(word),
      noteWidth: note ? note.offsetWidth : null,
      placement: word ? word.dataset.notePlacement ?? null : null,
      weeks: document.querySelectorAll(".gh-grid-week").length,
      cells: document.querySelectorAll(".gh-grid-cell").length,
      label: document.querySelector(".gh-grid-label")?.textContent ?? null,
    };
  });

  await page.screenshot({ path: path.join(OUT, `hero-${label}.png`) });
  await page.close();
  return metrics;
}

const out = {
  desktopHover: await run("/", "github-desktop", { width: 1440, height: 900 }, true),
  desktopIdle: await run("/es", "github-es-idle", { width: 1440, height: 900 }, false),
  mobile: await run("/", "github-mobile", { width: 390, height: 844 }, false),
};

await browser.close();
console.log(JSON.stringify(out, null, 2));

