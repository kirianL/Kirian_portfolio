import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_SIZE_BYTES = 500 * 1024; // 500KB
const MAX_WIDTH = 1920;
const QUALITY = 80;
const SEARCH_DIRS = ["src/assets", "public"];

// Recursive function to get all files
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

async function optimizeImages() {
  console.log("Starting image optimization...");
  let optimizedCount = 0;
  let skippedCount = 0;

  for (const dir of SEARCH_DIRS) {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      console.warn(`Directory not found: ${fullPath}`);
      continue;
    }

    const files = getAllFiles(fullPath);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;

      try {
        const stats = fs.statSync(file);
        if (stats.size > MAX_SIZE_BYTES) {
          console.log(
            `Optimizing: ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`,
          );

          const newFilePath = file.replace(ext, ".webp");

          const image = sharp(file);
          const metadata = await image.metadata();

          let pipeline = image.webp({ quality: QUALITY });

          if (metadata.width > MAX_WIDTH) {
            console.log(
              `  Resizing from ${metadata.width}px to ${MAX_WIDTH}px`,
            );
            pipeline = pipeline.resize({ width: MAX_WIDTH });
          }

          await pipeline.toFile(newFilePath);

          const newStats = fs.statSync(newFilePath);
          console.log(
            `  Saved as: ${newFilePath} (${(newStats.size / 1024 / 1024).toFixed(2)} MB)`,
          );

          optimizedCount++;
        } else {
          skippedCount++;
        }
      } catch (err) {
        console.error(`  Error processing ${file}:`, err);
      }
    }
  }

  console.log("--------------------------------");
  console.log(`Optimization complete.`);
  console.log(`Optimized: ${optimizedCount} images`);
  console.log(`Skipped (already small): ${skippedCount} images`);
}

optimizeImages();
