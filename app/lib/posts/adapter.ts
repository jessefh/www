import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'posts');

export function readPostSlugs(): string[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
}

export function readPostFile(filename: string) {
  const full = path.join(postsDir, filename);
  return fs.readFileSync(full, 'utf8');
}
