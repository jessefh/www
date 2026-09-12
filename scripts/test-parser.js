const assert = require('assert');

function parseFrontMatter(content) {
  if (!content.startsWith('---')) return { meta: {}, body: content };
  const end = content.indexOf('\n---', 3);
  if (end === -1) return { meta: {}, body: content };
  const raw = content.slice(3, end + 0).trim();
  const body = content.slice(end + 4).trim();
  const meta = {};
  raw.split(/\n+/).forEach(line => {
    const [k, ...rest] = line.split(':');
    if (!k) return;
    const key = k.trim();
    const val = rest.join(':').trim();
    try {
      if (val.startsWith('[') && val.endsWith(']')) {
        const items = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['\"]|['\"]$/g, ''));
        meta[key] = items;
      } else {
        meta[key] = val.replace(/^['\"]|['\"]$/g, '');
      }
    } catch (e) {
      meta[key] = val;
    }
  });
  return { meta, body };
}

// Test cases
const sample = `---\ntitle: Test Post\ndate: 2026-01-01\ntags: [a, b]\n---\nThis is body.`;
const parsed = parseFrontMatter(sample);
assert.strictEqual(parsed.meta.title, 'Test Post');
assert.strictEqual(parsed.meta.date, '2026-01-01');
assert.deepStrictEqual(parsed.meta.tags, ['a','b']);
assert.strictEqual(parsed.body, 'This is body.');

console.log('parser test: OK');
