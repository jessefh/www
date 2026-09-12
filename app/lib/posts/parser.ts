export type PostMeta = Record<string, string | string[] | undefined> & {
  title?: string;
  date?: string;
  tags?: string[];
};

export function parseFrontMatter(content: string) {
  if (!content.startsWith('---')) return { meta: {}, body: content };
  const end = content.indexOf('\n---', 3);
  if (end === -1) return { meta: {}, body: content };
  const raw = content.slice(3, end + 0).trim();
  const body = content.slice(end + 4).trim();
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
