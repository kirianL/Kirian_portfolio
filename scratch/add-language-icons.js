import fs from "fs";
import path from "path";

const iconsPath = path.resolve("./src/data/svgl-icons.json");
const currentIcons = JSON.parse(fs.readFileSync(iconsPath, "utf-8"));

const sources = {
  html5: "https://raw.githubusercontent.com/pheralb/svgl/main/static/library/html5.svg",
  html: "https://raw.githubusercontent.com/pheralb/svgl/main/static/library/html5.svg",
  css: "https://raw.githubusercontent.com/pheralb/svgl/main/static/library/css.svg",
  css3: "https://raw.githubusercontent.com/pheralb/svgl/main/static/library/css.svg",
  php: "https://raw.githubusercontent.com/pheralb/svgl/main/static/library/php.svg",
  csharp: "https://raw.githubusercontent.com/pheralb/svgl/main/static/library/csharp.svg",
  c: "https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg",
  cpp: "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg",
  java: "https://raw.githubusercontent.com/pheralb/svgl/main/static/library/java.svg",
  go: "https://raw.githubusercontent.com/pheralb/svgl/main/static/library/golang.svg",
  golang: "https://raw.githubusercontent.com/pheralb/svgl/main/static/library/golang.svg",
  rust: "https://raw.githubusercontent.com/pheralb/svgl/main/static/library/rust.svg",
};

async function main() {
  for (const [key, url] of Object.entries(sources)) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const svg = (await res.text()).trim();
        currentIcons[key] = { single: svg };
        console.log(`✓ Added ${key}`);
      }
    } catch (e) {
      console.error(`Failed ${key}:`, e);
    }
  }

  // SQL icon (Standard relational database cylinder emblem in SQL blue)
  currentIcons["sql"] = {
    single: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#336791" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" fill="#EBF3FA"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`
  };

  fs.writeFileSync(iconsPath, JSON.stringify(currentIcons, null, 2), "utf-8");
  console.log("Successfully updated svgl-icons.json with new languages!");
}

main();
