export type GoodreadsBook = {
  bookTitle: string;
  bookTitleUrl: string;
  bookAuthor: string;
  bookAuthorUrl: string;
};

export const GOODREADS_PROFILE_URL = "https://www.goodreads.com/user/show/65474722-jesse";

const FALLBACK_BOOK: GoodreadsBook = {
  bookTitle: "De Graaf van Montecristo",
  bookTitleUrl: "https://www.goodreads.com/book/show/17208904-de-graaf-van-montecristo",
  bookAuthor: "Alexandre Dumas",
  bookAuthorUrl: "https://www.goodreads.com/author/show/4785.Alexandre_Dumas",
};

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&ldquo;/gi, "“")
    .replace(/&rdquo;/gi, "”")
    .replace(/&lsquo;/gi, "‘")
    .replace(/&rsquo;/gi, "’")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&#x27;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeGoodreadsUrl(value: string) {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://www.goodreads.com${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

function normalizeBookTitle(value: string) {
  const cleaned = decodeHtmlEntities(value).trim();

  if (cleaned.toLowerCase() === "de graaf van montecristo") {
    return "De Graaf van Montecristo";
  }

  return cleaned.replace(/\s+/g, " ");
}

function extractLink(html: string, className: string) {
  const pattern = new RegExp(
    `<a class="${className}"[^>]*href="([^"]+)"[^>]*>([\\s\\S]*?)<\\/a>`,
    "i",
  );
  const match = html.match(pattern);

  if (!match) return null;

  return {
    href: match[1],
    text: match[2],
  };
}

import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'goodreads.json');
// Cache settings
// - `memoryCache`: very fast in-process cache for immediate repeated requests.
// - filesystem cache (`.cache/goodreads.json`): survives process restarts without
//   requiring external infrastructure. Both respect `CACHE_TTL`.
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
let memoryCache: { ts: number; data: GoodreadsBook } | null = null;

async function fetchProfileHtml() {
  const response = await fetch(GOODREADS_PROFILE_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; JesseSiteBot/1.0; +https://jessefh.dev)",
      Accept: "text/html,application/xhtml+xml",
    },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error('bad response');
  return await response.text();
}

function readCache(): GoodreadsBook | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const raw = fs.readFileSync(CACHE_FILE, 'utf8');
    const json = JSON.parse(raw);
    if (!json.ts || !json.data) return null;
    if (Date.now() - json.ts > CACHE_TTL) return null;
    return json.data as GoodreadsBook;
  } catch {
    return null;
  }
}

function writeCache(data: GoodreadsBook) {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ ts: Date.now(), data }), 'utf8');
  } catch {}
}

export async function getCurrentlyReading(): Promise<GoodreadsBook> {
  try {
    // Cache lookup order:
    // 1) in-memory cache (fast, per-process)
    // 2) filesystem cache (durable across restarts)
    // 3) network fetch from Goodreads
    // On successful fetch we populate both filesystem and memory caches.
    // Errors fall back to `FALLBACK_BOOK` to keep site stable.
    // This keeps visitor latency low while avoiding committing cache to the repo.

    // check in-memory cache first (fast path)
    if (memoryCache && Date.now() - memoryCache.ts <= CACHE_TTL) {
      return memoryCache.data;
    }

    // then check filesystem cache
    const cached = readCache();
    if (cached) {
      memoryCache = { ts: Date.now(), data: cached };
      return cached;
    }

    const html = await fetchProfileHtml();
    const currentReadingSection = html.match(
      /id="currentlyReadingReviews"[\s\S]*?(?=<a class="actionLinkLite" href="https:\/\/www\.goodreads\.com\/review\/list\/65474722-jesse\?shelf=currently-reading">currently-reading<\/a>|$)/i,
    );

    if (!currentReadingSection) {
      return FALLBACK_BOOK;
    }

    const section = currentReadingSection[0];
    const bookTitleLink = extractLink(section, "bookTitle");
    const authorLink = extractLink(section, "authorName");

    if (!bookTitleLink || !authorLink) {
      return FALLBACK_BOOK;
    }

    const titleUrl = normalizeGoodreadsUrl(bookTitleLink.href);
    const authorUrl = normalizeGoodreadsUrl(authorLink.href);
    const bookTitle = normalizeBookTitle(bookTitleLink.text.replace(/<[^>]+>/g, ""));
    const bookAuthor = decodeHtmlEntities(authorLink.text.replace(/<[^>]+>/g, ""));

    if (!bookTitle || !bookAuthor) {
      return FALLBACK_BOOK;
    }

    const result = {
      bookTitle,
      bookTitleUrl: titleUrl,
      bookAuthor,
      bookAuthorUrl: authorUrl,
    } as GoodreadsBook;

    writeCache(result);
    memoryCache = { ts: Date.now(), data: result };

    return result;
  } catch {
    return FALLBACK_BOOK;
  }
}

export const GOODREADS_CURRENTLY_READING = FALLBACK_BOOK;
