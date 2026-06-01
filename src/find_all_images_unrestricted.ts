import * as fs from 'fs';
import * as path from 'path';

const matches: string[] = [];

function findFiles(dir: string, depth = 0) {
  if (depth > 12) return;
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (
            file !== 'node_modules' &&
            file !== '.git' &&
            file !== 'cache' &&
            !fullPath.includes('/proc') &&
            !fullPath.includes('/sys') &&
            !fullPath.includes('/dev')
          ) {
            findFiles(fullPath, depth + 1);
          }
        } else {
          const lower = file.toLowerCase();
          if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp')) {
            const ageHr = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60);
            if (ageHr < 1.0) { // last 1 hour
              matches.push(`${fullPath} (${(stat.size / 1024).toFixed(1)} KB) - Age: ${ageHr.toFixed(2)}h`);
            }
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
}

findFiles('/');
console.log('--- ALL RECENT IMAGES ON DISK (< 1 hour) ---');
matches.forEach(m => console.log(m));
console.log('--- Completed ---');
