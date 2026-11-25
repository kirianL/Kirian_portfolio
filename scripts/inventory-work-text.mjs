import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");

const OUT = path.resolve("references/verify");
fs.mkdirSync(OUT, { recursive: true });

const TARGETS = [
  { id: "koragrid", port: 4401, routes: ["/", "/en"] },
  { id: "customerup", port: 4402, routes: ["/"] },
  { id: "kora-finance", port: 4403, routes: ["/"] },
  { id: "alder-psicologia", port: 4404, routes: ["/"] },
  { id: "mp-legal", port: 4405, routes: ["/"] },
];

const browser = await chromium.launch();
const report = {};

for (const target of TARGETS) {
  report[target.id] = {};
  for (const route of target.routes) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`http://localhost:${target.port}${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
    const items = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const out = [];
      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent.trim();
        if (!text) continue;
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const r = range.getBoundingClientRect();
        if (r.width === 0 || r.height === 0 || r.top >= 800 || r.bottom <= 0) continue;
        out.push({
          text,
          tag: parent.tagName.toLowerCase(),
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
        });
      }
      return { url: location.href, scrollY: window.scrollY, items: out };
    });
    report[target.id][route] = items;
    await page.close();
  }
}

await browser.close();
fs.writeFileSync(path.join(OUT, "work-text-inventory.json"), JSON.stringify(report, null, 2));
for (const [id, routes] of Object.entries(report)) {
  console.log(`\n=== ${id}`);
  for (const [route, data] of Object.entries(routes)) {
    console.log(`  ${route} -> ${data.url} scrollY=${data.scrollY} (${data.items.length} text nodes)`);
    for (const item of data.items) {
      console.log(`    [${item.y.toString().padStart(3)},${item.x.toString().padStart(4)}] ${item.text.slice(0, 160)}`);
    }
  }
}
