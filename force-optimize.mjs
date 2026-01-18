import sharp from "sharp";
import path from "path";

const filesToConvert = [
  "src/assets/ImagesProjects/Puerto-Limon/Carrusel2.jpg",
  "src/assets/costa-rica.png",
];

async function forceOptimize() {
  for (const file of filesToConvert) {
    try {
      const inputPath = path.join(process.cwd(), file);
      const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/, ".webp");

      console.log(`Converting ${inputPath} to ${outputPath}`);

      await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);

      console.log("Success!");
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  }
}

forceOptimize();
