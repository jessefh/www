(async function(){
  const res = await fetch('https://www.goodreads.com/user/show/65474722-jesse', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  console.log('len', html.length);
  const re = new RegExp('<a[^>]*class="[^"]*bookTitle[^"]*"[^>]*href="([^"]+)"[^>]*>([\\s\\S]*?)<\\/a>', 'i');
  const m = html.match(re);
  console.log('match?', !!m);
  if (m) console.log('href:', m[1], 'text snippet:', m[2].slice(0,80));
})();

// Exit with non-zero when not found so CI can fail the job.
process.on('unhandledRejection', (err) => { console.error(err && err.message); process.exit(3); });
process.on('uncaughtException', (err) => { console.error(err && err.message); process.exit(3); });
(async function checkExit(){
  try {
    const res = await fetch('https://www.goodreads.com/user/show/65474722-jesse', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const re = new RegExp('<a[^>]*class="[^\"]*bookTitle[^\"]*"[^>]*href="([^\"]+)"[^>]*>([\\s\\S]*?)<\\/a>', 'i');
    const m = html.match(re);
    if (!m) {
      console.error('health-check: no bookTitle anchor found');
      process.exit(2);
    }
    const reAuthor = new RegExp('<a[^>]*class="[^\"]*authorName[^\"]*"[^>]*href="([^\"]+)"[^>]*>([\\s\\S]*?)<\\/a>', 'i');
    const ma = html.match(reAuthor);
    if (!ma) {
      console.error('health-check: no authorName anchor found');
      process.exit(2);
    }
    console.log('health-check: OK');
    process.exit(0);
  } catch (e) {
    console.error('health-check error:', e && e.message);
    process.exit(3);
  }
})();
