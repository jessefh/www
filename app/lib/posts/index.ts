import { readPostSlugs, readPostFile } from './adapter';
import { parseFrontMatter, Post } from './parser';

let cached: { ts: number; posts: Post[] } | null = null;
const TTL = 60 * 1000; // 60s cache for server process

export function getPostSlugs(): string[] {
  return readPostSlugs();
}

export function getPostBySlug(filename: string) {
  const raw = readPostFile(filename);
  const { meta, body } = parseFrontMatter(raw);
  const slug = filename.replace(/\.md$/, '');
  return { slug, meta, body };
}

export function getAllPosts() {
  if (cached && Date.now() - cached.ts < TTL) return cached.posts;

  const posts = getPostSlugs().map(s => getPostBySlug(s)).sort((a,b) => (b.meta.date||'').localeCompare(a.meta.date||''));
  cached = { ts: Date.now(), posts };
  return posts;
}
