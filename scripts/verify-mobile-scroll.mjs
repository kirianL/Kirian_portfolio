import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");
const browser = await chromium.launch();

const measure = async (page) =>
  page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
    };
    return {
      hero: pick("section[class*='min-h-']"),
      banner: pick(".red-dither-banner"),
      name: pick("h1"),
      lenis: !!(window).__lenis,
      scrollY: window.scrollY,
      vh: window.innerHeight,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
    };
  });

const results = {};
for (const [name, opts] of [
  ["touch", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["desktop", { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }],
]) {
  const context = await browser.newContext(opts);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:4455/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('a[href*="github.com/kirianL"]', { state: "visible" });
  await page.waitForTimeout(1500);

  const before = await measure(page);
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(400);
  const down = await measure(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const up = await measure(page);

  results[name] = {
    before,
    down: { scrollY: down.scrollY, hero: down.hero },
    up,
    layoutShift: JSON.stringify(before) === JSON.stringify(up),
    errors,
  };
  await context.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
