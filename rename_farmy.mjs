import fs from 'fs/promises';
import path from 'path';

const SRC_DIR = './src';
const ROOT_FILES = ['./index.html', './package.json', './README.md', './UI_COMPLETION_SUMMARY.md'];

async function replaceInFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let original = content;

    // Replacements
    content = content.replace(/FarmDiaries/g, 'FARMY');
    content = content.replace(/FarmDiary/g, 'FARMY');
    content = content.replace(/farmdiaries/g, 'farmy');
    content = content.replace(/farmdiary/g, 'farmy');

    if (content !== original) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Error processing ${filePath}:`, err.message);
    }
  }
}

async function walkDir(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walkDir(fullPath);
      } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.html') || fullPath.endsWith('.css') || fullPath.endsWith('.json') || fullPath.endsWith('.md'))) {
        await replaceInFile(fullPath);
      }
    }
  } catch(e) {}
}

async function run() {
  console.log('Starting global rename...');
  await walkDir(SRC_DIR);
  for (const file of ROOT_FILES) {
    await replaceInFile(file);
  }
  console.log('Rename complete.');
}

run();
