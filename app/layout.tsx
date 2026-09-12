import type { Metadata } from "next";
import { VT323, Source_Serif_4 } from "next/font/google";
import ThemeToggle from "./theme-toggle";
import "./globals.css";
import { themeInitScript } from "./lib/theme";

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-game",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "jessefh.dev",
    template: "%s - jessefh.dev",
  },
};

// dark is the default theme; apply a stored "light" choice before paint to avoid a flash

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${vt323.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <header className="titlebar">
          <a href="https://github.com/jessefh" className="titlebar-name" target="_blank" rel="noopener noreferrer">jessefh.dev</a>
          <nav className="titlebar-links">
            <a href="/">Home</a>
            <span className="sep">/</span>
            <a href="/about">About</a>
            <span className="sep">/</span>
            <a href="/blog">Blog</a>
            <span className="sep">/</span>
            <ThemeToggle />
          </nav>
        </header>

        <main className="main">{children}</main>

        <footer className="footer">© 2026 jessefh.dev. Updated occasionally.</footer>
      </body>
    </html>
  );
}
