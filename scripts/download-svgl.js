import fs from 'fs';
import path from 'path';

const mapping = {
  "typescript": "https://svgl.app/library/typescript.svg",
  "javascript": "https://svgl.app/library/javascript.svg",
  "python": "https://svgl.app/library/python.svg",
  "figma": "https://svgl.app/library/figma.svg",
  "paper": "https://svgl.app/library/paper.svg",
  "pencil": "https://svgl.app/library/paper.svg", // fallback design tool
  "react": {
    "light": "https://svgl.app/library/react_light.svg",
    "dark": "https://svgl.app/library/react_dark.svg"
  },
  "nextjs": "https://svgl.app/library/nextjs_icon_dark.svg",
  "tanstack": "https://svgl.app/library/tanstack.svg",
  "tailwindcss": "https://svgl.app/library/tailwindcss.svg",
  "shadcnui": {
    "light": "https://svgl.app/library/shadcn-ui.svg",
    "dark": "https://svgl.app/library/shadcn-ui_dark.svg"
  },
  "radixui": {
    "light": "https://svgl.app/library/radix-ui_light.svg",
    "dark": "https://svgl.app/library/radix-ui_dark.svg"
  },
  "baseui": {
    "light": "https://svgl.app/library/base-ui.svg",
    "dark": "https://svgl.app/library/base-ui-dark.svg"
  },
  "motion": {
    "light": "https://svgl.app/library/motion.svg",
    "dark": "https://svgl.app/library/motion_dark.svg"
  },
  "fumadocs": "https://svgl.app/library/react_dark.svg", // fallback
  "zod": "https://svgl.app/library/zod.svg",
  "redux": "https://svgl.app/library/redux.svg",
  "zustand": "https://svgl.app/library/redux.svg", // fallback
  "betterauth": {
    "light": "https://svgl.app/library/better-auth_light.svg",
    "dark": "https://svgl.app/library/better-auth_dark.svg"
  },
  "clerk": {
    "light": "https://svgl.app/library/clerk-icon-light.svg",
    "dark": "https://svgl.app/library/clerk-icon-dark.svg"
  },
  "firebase": "https://svgl.app/library/firebase.svg",
  "supabase": "https://svgl.app/library/supabase.svg",
  "convex": "https://svgl.app/library/convex.svg",
  "nodejs": "https://svgl.app/library/nodejs.svg",
  "bun": "https://svgl.app/library/bun.svg",
  "prisma": {
    "light": "https://svgl.app/library/prisma.svg",
    "dark": "https://svgl.app/library/prisma_dark.svg"
  },
  "drizzle": {
    "light": "https://svgl.app/library/drizzle-orm_light.svg",
    "dark": "https://svgl.app/library/drizzle-orm_dark.svg"
  },
  "postgresql": "https://svgl.app/library/postgresql.svg",
  "mongodb": {
    "light": "https://svgl.app/library/mongodb-icon-light.svg",
    "dark": "https://svgl.app/library/mongodb-icon-dark.svg"
  },
  "redis": "https://svgl.app/library/redis.svg",
  "cursor": {
    "light": "https://svgl.app/library/cursor_light.svg",
    "dark": "https://svgl.app/library/cursor_dark.svg"
  },
  "claudecode": "https://svgl.app/library/claude-ai-icon.svg",
  "pi": {
    "light": "https://svgl.app/library/inflectionai_light.svg",
    "dark": "https://svgl.app/library/inflectionai_dark.svg"
  },
  "opencode": {
    "light": "https://svgl.app/library/opencode.svg",
    "dark": "https://svgl.app/library/opencode-dark.svg"
  },
  "codex": {
    "light": "https://svgl.app/library/codex_light.svg",
    "dark": "https://svgl.app/library/codex_dark.svg"
  },
  "antigravity": "https://svgl.app/library/antigravity.svg",
  "cal": {
    "light": "https://svgl.app/library/cal.svg",
    "dark": "https://svgl.app/library/cal_dark.svg"
  },
  "airbnb": "https://svgl.app/library/airbnb.svg",
  "meta": "https://svgl.app/library/meta.svg"
};

async function fetchSvg(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let text = await res.text();
    // Clean XML/Doctype headers if present
    text = text.replace(/<\?xml[^>]*\?>/gi, "");
    text = text.replace(/<!DOCTYPE[^>]*>/gi, "");
    return text.trim();
  } catch (err) {
    console.error(`Failed to fetch SVG from: ${url}`, err);
    return null;
  }
}

async function main() {
  console.log("Starting SVGL SVG downloader...");
  const svgs = {};

  for (const [key, val] of Object.entries(mapping)) {
    console.log(`Processing: ${key}...`);
    if (typeof val === 'string') {
      const code = await fetchSvg(val);
      if (code) {
        svgs[key] = { single: code };
      }
    } else {
      const lightCode = await fetchSvg(val.light);
      const darkCode = await fetchSvg(val.dark);
      if (lightCode || darkCode) {
        svgs[key] = {
          light: lightCode || darkCode,
          dark: darkCode || lightCode
        };
      }
    }
  }

  const targetDir = path.resolve('src/data');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'svgl-icons.json');
  fs.writeFileSync(targetFile, JSON.stringify(svgs, null, 2));
  console.log(`Successfully saved all SVGs to: ${targetFile}`);
}

main();
