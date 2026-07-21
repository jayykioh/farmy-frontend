import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../../../../../../d:/coding/farmy-fe/public');
// Wait, path resolution is tricky. Let's just use absolute path directly.

const publicDir = 'd:/coding/farmy-fe/public';
const logoPath = path.join(publicDir, 'logo.png');

async function generateIcons() {
  console.log('Generating icons...');
  try {
    // Generate favicon.ico (16x16, 32x32, 48x48) - Sharp does not natively export .ico easily without an external library or raw byte writing, 
    // but wait, we can just save it as favicon.png and rename, or save as favicon.ico if sharp supports it.
    // Actually, sharp can output PNG. Modern browsers support PNG favicons. We can just generate favicon.png and update index.html to use it.
    // However, some legacy tools expect .ico. We can just use a 32x32 png as favicon.ico, browsers handle it fine.
    
    // We'll generate a 32x32 favicon.ico (which is actually a png underneath but named .ico, most modern browsers handle this fine, or we'll just name it favicon.png)
    await sharp(logoPath).resize(64, 64).toFile(path.join(publicDir, 'favicon.png'));
    console.log('Generated favicon.png');

    // Generate PWA icons
    await sharp(logoPath).resize(192, 192).toFile(path.join(publicDir, 'logo192.png'));
    console.log('Generated logo192.png');

    await sharp(logoPath).resize(512, 512).toFile(path.join(publicDir, 'logo512.png'));
    console.log('Generated logo512.png');

    // Apple Touch Icon
    await sharp(logoPath).resize(180, 180).toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');

    console.log('Done!');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();
