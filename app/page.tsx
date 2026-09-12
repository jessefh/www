import Link from "next/link";
import { getCurrentlyReading } from "./lib/goodreads";

export default async function Home() {
  const current = await getCurrentlyReading();

  return (
    <div>
      <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", margin: "0 0 20px" }}>
        <span style={{ color: "var(--faint)" }}>Hi, I&rsquo;m </span>
        <span style={{ color: "var(--ink)" }}>Jesse Haenen</span>
      </h1>
      <div className="prose">
        <p>
          Currently reading: <Link href={current.bookTitleUrl}>{current.bookTitle}</Link>.
        </p>
      </div>
      <p style={{ marginTop: 28 }}>
        <a className="btn" href="/blog">Read the blog</a>
      </p>
    </div>
  );
}
