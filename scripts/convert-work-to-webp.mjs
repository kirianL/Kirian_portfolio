import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("public/work");
const QUALITY = 0.82; // optimized for web

const files = fs.readdirSync(ROOT).filter((f) => f.endsWith(".jpg"));
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage();

for (const file of files) {
  const src = path.join(ROOT, file);
  const out = path.join(ROOT, file.replace(/\.jpg$/, ".webp"));
  const b64 = fs.readFileSync(src).toString("base64");
  const webp = await page.evaluate(
    async ({ b64, quality }) => {
      const img = new Image();
      img.src = `data:image/jpeg;base64,${b64}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      return {
        data: canvas.toDataURL("image/webp", quality).split(",")[1],
        w: img.naturalWidth,
        h: img.naturalHeight,
      };
    },
    { b64, quality: QUALITY },
  );
  const buf = Buffer.from(webp.data, "base64");
  fs.writeFileSync(out, buf);
  const jpgSize = fs.statSync(src).size;
  console.log(
    `${file} (${webp.w}x${webp.h}) ${(jpgSize / 1024) | 0}KB -> webp ${(buf.length / 1024) | 0}KB`,
  );
}

await browser.close();
