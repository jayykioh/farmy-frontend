import fs from 'fs';
import path from 'path';

function checkPathCase(filePath) {
  if (filePath === path.parse(filePath).root) return true;
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  if (!checkPathCase(dir)) return false;
  
  if (!fs.existsSync(dir)) return false;
  const files = fs.readdirSync(dir);
  if (!files.includes(base)) {
    console.error(`Case mismatch or missing: ${filePath}`);
    return false;
  }
  return true;
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
          const resolvedPath = path.resolve(dir, importPath);
          let targetPath = resolvedPath;
          if (fs.existsSync(targetPath + '.ts')) targetPath += '.ts';
          else if (fs.existsSync(targetPath + '.tsx')) targetPath += '.tsx';
          else if (fs.existsSync(targetPath + '/index.ts')) targetPath += '/index.ts';
          else if (fs.existsSync(targetPath + '/index.tsx')) targetPath += '/index.tsx';
          
          if (fs.existsSync(targetPath)) {
            checkPathCase(targetPath);
          }
        } else if (importPath.startsWith('@/')) {
          const resolvedPath = path.resolve(process.cwd(), 'src', importPath.slice(2));
          let targetPath = resolvedPath;
          if (fs.existsSync(targetPath + '.ts')) targetPath += '.ts';
          else if (fs.existsSync(targetPath + '.tsx')) targetPath += '.tsx';
          else if (fs.existsSync(targetPath + '/index.ts')) targetPath += '/index.ts';
          else if (fs.existsSync(targetPath + '/index.tsx')) targetPath += '/index.tsx';
          
          if (fs.existsSync(targetPath)) {
            checkPathCase(targetPath);
          }
        }
      }
    }
  }
}

traverse(path.join(process.cwd(), 'src'));
