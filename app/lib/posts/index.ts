import { readPostSlugs, readPostFrontMatter, readPostFile } from './adapter';
import { parseFrontMatter, Post, PostMeta } from './parser';

let cached: { ts: number; posts: Post[] } | null = null;
let cachedSummaries: { ts: number; posts: PostSummary[] } | null = null;
const TTL = 60 * 1000; // 60s cache for server process

type PostSummary = { slug: string; meta: PostMeta };

export function getPostSlugs(): string[] {
  return readPostSlugs();
}

export function getPostBySlug(filename: string) {
  const raw = readPostFile(filename);
  const { meta, body } = parseFrontMatter(raw);
  const slug = filename.replace(/\.md$/, '');
  return { slug, meta, body };
}

function getPostSummaryBySlug(filename: string): PostSummary {
  const raw = readPostFrontMatter(filename);
  const { meta } = parseFrontMatter(raw);
  const slug = filename.replace(/\.md$/, '');
  return { slug, meta };
}

export function getAllPosts() {
  if (cached && Date.now() - cached.ts < TTL) return cached.posts;

  const posts = getPostSlugs().map(s => getPostBySlug(s)).sort((a,b) => (b.meta.date||'').localeCompare(a.meta.date||''));
  cached = { ts: Date.now(), posts };
  return posts;
}

export function getAllPostSummaries() {
  if (cachedSummaries && Date.now() - cachedSummaries.ts < TTL) return cachedSummaries.posts;

  const posts = getPostSlugs().map(s => getPostSummaryBySlug(s)).sort((a,b) => (b.meta.date||'').localeCompare(a.meta.date||''));
  cachedSummaries = { ts: Date.now(), posts };
  return posts;
}
