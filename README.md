# jessefh.dev

[![Build status](https://github.com/jessefh/www/actions/workflows/goodreads-refresh-and-check.yml/badge.svg)](https://github.com/jessefh/www/actions/workflows/goodreads-refresh-and-check.yml)

Personal site and blog. Built with Next.js, React, TypeScript, and minimal CSS. Blog posts live in [`posts/`](posts/).

GitHub Actions runs a lightweight parser health check for the Goodreads integration on pushes to `main` and on its daily schedule.

## Development

Install dependencies, then start the development server:

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000) in your browser.

## Commands

```bash
npm run lint   # Check code quality
npm run build  # Create a production build
npm run start  # Serve the production build
```

© 2026 jessefh.dev. All rights reserved.
