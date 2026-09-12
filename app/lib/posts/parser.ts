export type PostMeta = Record<string, string | string[] | undefined> & {
  title?: string;
  date?: string;
  tags?: string[];
};

export function matchFrontMatter(content: string) {
  return /^---\r?\n([\s\S]*?)(\r?\n---)(?:\r?\n|$)/.exec(content);
}

export function parseFrontMatter(content: string) {
  if (!content.startsWith('---')) return { meta: {}, body: content };
  const match = matchFrontMatter(content);
  if (!match) return { meta: {}, body: content };
  const raw = match[1].trim();
  const body = content.slice(match[0].length).trim();
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
