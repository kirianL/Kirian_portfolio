import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function main() {
  const inputPath = path.resolve('public/blog-limon-identity.png');
  const outputPath = path.resolve('public/blog-limon-identity.jpg');

  console.log(`Optimizing OG image from ${inputPath} to ${outputPath}...`);

  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`Original image: ${metadata.width}x${metadata.height} (${metadata.format})`);

    // Resize to standard 1200x630 landscape ratio and save as compressed JPEG
    await sharp(inputPath)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 80,
        mozjpeg: true // Uses progressive loading and better compression
      })
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    console.log(`Successfully generated optimized image!`);
    console.log(`New size: ${(newStats.size / 1024).toFixed(2)} KB (Target: < 300 KB)`);

  } catch (err) {
    console.error('Error optimizing image:', err);
  }
}

main();
