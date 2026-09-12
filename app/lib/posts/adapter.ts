import fs from 'fs';
import path from 'path';
import { StringDecoder } from 'string_decoder';
import { matchFrontMatter } from './parser';

const postsDir = path.join(process.cwd(), 'posts');

export function readPostSlugs(): string[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
}

export function readPostFrontMatter(filename: string) {
  const full = path.join(postsDir, filename);
  const fd = fs.openSync(full, 'r');
  const chunk = Buffer.alloc(1024);
  const decoder = new StringDecoder('utf8');
  let content = '';
  let position = 0;

  try {
    while (true) {
      const bytesRead = fs.readSync(fd, chunk, 0, chunk.length, position);
      if (bytesRead === 0) return content + decoder.end();

      position += bytesRead;
      content += decoder.write(chunk.subarray(0, bytesRead));

      if (!content.startsWith('---')) return content;

      const match = matchFrontMatter(content);
      if (match) return content.slice(0, match[0].length);
    }
  } finally {
    fs.closeSync(fd);
  }
}

export function readPostFile(filename: string) {
  const full = path.join(postsDir, filename);
  return fs.readFileSync(full, 'utf8');
}
