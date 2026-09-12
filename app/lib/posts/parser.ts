export type PostMeta = Record<string, string | string[] | undefined> & {
  title?: string;
  date?: string;
  tags?: string[];
};

export function findFrontMatterEnd(content: string) {
  const match = /\r?\n---/.exec(content.slice(3));
  if (!match || match.index === undefined) return null;

  const newlineLength = match[0].startsWith('\r\n') ? 2 : 1;
  const end = match.index + 3;
  return { end, boundaryLength: newlineLength + 3 };
}

export function parseFrontMatter(content: string) {
  if (!content.startsWith('---')) return { meta: {}, body: content };
  const frontMatterEnd = findFrontMatterEnd(content);
  if (!frontMatterEnd) return { meta: {}, body: content };
  const raw = content.slice(3, frontMatterEnd.end).trim();
  const body = content.slice(frontMatterEnd.end + frontMatterEnd.boundaryLength).trim();
  const meta: PostMeta = {};
  raw.split(/\n+/).forEach(line => {
    const [k, ...rest] = line.split(':');
    if (!k) return;
    const key = k.trim();
    const val = rest.join(':').trim();
    try {
      if (val.startsWith('[') && val.endsWith(']')) {
        const items = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        meta[key] = items;
      } else {
        meta[key] = val.replace(/^['"]|['"]$/g, '');
      }
    } catch {
      meta[key] = val;
    }
  });
  return { meta, body };
}

export type Post = { slug: string; meta: PostMeta; body: string };
