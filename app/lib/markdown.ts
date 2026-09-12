import { marked } from 'marked';
import { codeToHtml } from 'shiki';

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function renderMarkdown(md: string) {
  const tokens = marked.lexer(md);
  const codeBlocks = tokens.filter((t): t is { type: 'code'; text: string; lang?: string } => t.type === 'code');

  const highlighted = new Map<string, string>();
  for (const block of codeBlocks) {
    const lang = (block.lang || '').trim().split(/\s+/)[0] || 'text';
    const key = `${lang}\u0000${block.text}`;
    if (highlighted.has(key)) continue;
    try {
      highlighted.set(
        key,
        await codeToHtml(block.text, {
          lang,
          themes: { light: 'rose-pine-dawn', dark: 'rose-pine' },
          defaultColor: false,
        })
      );
    } catch {
      highlighted.set(key, `<pre><code>${escapeHtml(block.text)}</code></pre>`);
    }
  }

  const renderer = new marked.Renderer();
  renderer.code = (code: string, infostring: string | undefined) => {
    const lang = (infostring || '').trim().split(/\s+/)[0] || 'text';
    const key = `${lang}\u0000${code}`;
    return highlighted.get(key) ?? `<pre><code>${escapeHtml(code)}</code></pre>`;
  };

  return marked.parse(md, { renderer });
}

export default renderMarkdown;
