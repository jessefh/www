import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div>
      <h1 style={{ fontSize: 26, margin: "0 0 20px" }}>About</h1>
      <div className="prose">
        <p>
          I&apos;m Jesse, a Data Engineer at OLVG. I promise I'll write someting here eventually.
        </p>
        <h2 style={{ fontSize: 18, marginTop: 20 }}>Tech stack</h2>
        <p>
          This blog uses Next.js (App Router, Turbopack), React, TypeScript,
          and minimal CSS. Content is Markdown files under <code>posts/</code>.
          The Goodreads scraper is a tiny server-side helper with an in-memory
          TTL cache and a small filesystem fallback. CI runs a lightweight
          parser-health check. Development was assisted with GitHub Copilot.
        </p>
      </div>
    </div>
  );
}
