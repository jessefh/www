---
title: "Currently reading: Goodreads scraping"
date: 2026-09-12
tags: [how-to, goodreads]
---

I like reading, and this felt like a silly little feature to show on the site: pull my Goodreads "currently reading" entry and link to the book.

This post explains what I implemented, why, and the minimal code I used so you can copy it or criticise it.

## Goals

- Keep the site small and fast for visitors.
- Avoid committing ephemeral cache into the repo.
- Detect parser breakage automatically (CI health check).

## Approach (short)

1. Server-side API `GET /api/goodreads/current` that returns a small JSON shape: `{ bookTitle, bookTitleUrl, bookAuthor, bookAuthorUrl }`.
2. In-process memory cache + small filesystem fallback cache (TTL = 1 hour) so visitors see a fast result without extra infra.
3. CI runs a lightweight parser-health check daily (and on push) that only verifies the book/author anchors still exist.

## Key code (essentials)

The API route simply calls a library function and returns JSON:

```ts
// app/api/goodreads/current/route.ts
import { NextResponse } from 'next/server';
import { getCurrentlyReading } from '../../../lib/goodreads';

export const revalidate = 3600; // let Next/edge cache this response

export async function GET() {
  const book = await getCurrentlyReading();
  return NextResponse.json(book);
}
```

The scraper lives in `app/lib/goodreads.ts`. I kept it small and defensive:

```ts
// core idea (trimmed)
export async function getCurrentlyReading() {
  // 1) check fast in-memory cache
  // 2) check small filesystem cache (.cache/goodreads.json)
  // 3) fetch Goodreads profile HTML and extract anchors
  // 4) write both caches on success; on error return a harmless fallback
}
```

I used a tiny, robust extractor that matches anchors by class name (handles multiple class tokens and newlines). The function decodes HTML entities and normalises Goodreads-relative URLs.

## CI health check (why and how)

Regex-based scrapers break when markup changes. I keep CI simple: the workflow runs `node scripts/debug-fetch.js` on a daily cron and on push. The script fetches the profile page and exits non-zero if it cannot find both `.bookTitle` and `.authorName` anchors. That gives me an early warning without changing site data.

```js
// scripts/debug-fetch.js (CI health check)
// exits non-zero if bookTitle or authorName anchors missing
```

## Why this design

- Visitor experience: in-memory cache makes the API respond quickly. Next's `revalidate` and the API TTL reduce external calls under load.
- Simplicity: no external datastore. The filesystem fallback survives occasional restarts and avoids surprising fresh empty pages.
- Safety: the CI check alerts me when the scraper needs adjustment; it does not write or commit any cache.

## Notes and trade-offs

- If you run on a fleet of stateless serverless instances and want a single canonical cache, move the cache to S3/Redis or commit the JSON from CI (I prefer S3/artifacts over repo commits).
- I deliberately kept the scraper small (no `jsdom`). If the page structure becomes more complex, swap to a tiny DOM parser like `node-html-parser`.

## TL;DR

I added a tiny API, an in-memory + filesystem cache, and a CI health check. The feature is small, performant for visitors, and safe for the repo.

If you want, I can: show the exact `getCurrentlyReading()` file, or switch the extractor to `node-html-parser` for extra robustness.
