import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const sourceDir = path.join(rootDir, 'app/lib/posts');

function compilePostsModule() {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'posts-compiled-'));
  for (const file of ['adapter.ts', 'index.ts', 'parser.ts']) {
    const source = fs.readFileSync(path.join(sourceDir, file), 'utf8');
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText;
    fs.writeFileSync(path.join(outDir, file.replace(/\.ts$/, '.js')), output);
  }

  return outDir;
}

test('getAllPostSummaries reads frontmatter only, caches, and keeps full-post sort order', () => {
  const cwd = process.cwd();
  const compiledDir = compilePostsModule();
  const repoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'posts-repo-'));
  const postsDir = path.join(repoDir, 'posts');
  const unicodeTitle = `${'x'.repeat(1012)}éabc`;
  fs.mkdirSync(postsDir);
  fs.writeFileSync(path.join(postsDir, 'older.md'), `---
title: Older
date: 2024-01-01
---

${'old\n'.repeat(2000)}`);
  fs.writeFileSync(path.join(postsDir, 'newer.md'), `---\r
title: Newer\r
date: 2025-01-01\r
---\r
\r
${'new\r\n'.repeat(2000)}`);
  fs.writeFileSync(path.join(postsDir, 'unicode.md'), `---
title: ${unicodeTitle}
date: 2023-06-01
---

body`);

  process.chdir(repoDir);

  try {
    const posts = require(path.join(compiledDir, 'index.js'));
    const readFileSync = fs.readFileSync;
    const movedPostsDir = path.join(repoDir, 'posts-moved');
    fs.readFileSync = () => {
      throw new Error('summary path should not read full post files');
    };

    const summaries = posts.getAllPostSummaries();
    try {
      assert.deepEqual(
        summaries.map((post) => ({ slug: post.slug, title: post.meta.title })),
        [
          { slug: 'newer', title: 'Newer' },
          { slug: 'older', title: 'Older' },
          { slug: 'unicode', title: unicodeTitle },
        ],
      );
      assert.equal('body' in summaries[0], false);

      fs.renameSync(postsDir, movedPostsDir);
      assert.deepEqual(posts.getAllPostSummaries(), summaries);
      fs.renameSync(movedPostsDir, postsDir);
    } finally {
      fs.readFileSync = readFileSync;
    }

    const fullPosts = posts.getAllPosts();
    assert.deepEqual(
      fullPosts.map((post) => post.slug),
      summaries.map((post) => post.slug),
    );
    assert.equal(typeof fullPosts[0].body, 'string');
  } finally {
    process.chdir(cwd);
    fs.rmSync(compiledDir, { recursive: true, force: true });
    fs.rmSync(repoDir, { recursive: true, force: true });
  }
});
