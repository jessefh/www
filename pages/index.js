import Head from 'next/head'

export default function Home({book}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Jesse Haenen</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />        
        <meta name="description" content="Full-stack Data Scientist from Amsterdam. Feel free to get in touch!" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <meta name="theme-color" content="white" />
        <meta property="og:title" content="Jesse Haenen" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Full-stack Data Scientist from Amsterdam. Feel free to get in touch!" />
        <meta property="og:url" content="https://jessehaenen.me" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-10 text-center text-gray-500">
        <h1 className="text-4xl sm:text-5xl font-inter">
          Hi, i'm <a className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-blue-500">Jesse Haenen</a>.
        </h1>

        <p className="text-lg sm:text-xl font-inter mt-2">
          I'm a full-stack data scientist from Amsterdam.
        </p>

        <ul class="flex mt-12 text-gray-500 font-mono text-sm">
          <li class="mx-3 border-b-2 border-transparent hover:border-b-2 hover:border-blue-500">
            <a href="">blog</a>
          </li>
          <li class="mx-3 border-b-2 border-transparent hover:border-b-2 hover:border-blue-500">
            <a href="mailto:jessehaenen@gmail.com">mail</a>
          </li>
          <li class="mx-3 border-b-2 border-transparent hover:border-b-2 hover:border-blue-500">
            <a href="https://www.linkedin.com/in/jesse-fh/" target="_blank" rel="noreferrer noopener">linkedin</a>
          </li>
          <li class="mx-3 border-b-2 border-transparent hover:border-b-2 hover:border-blue-500">
            <a href="https://github.com/jessefh" target="_blank" rel="noreferrer noopener">code</a>
          </li>
          <li class="mx-3 border-b-2 border-transparent hover:border-b-2 hover:hover:border-blue-500">
            <a href="/resume.pdf" target="_blank" rel="noreferrer noopener">resume</a>
          </li>
        </ul>

      <p class="mt-12 text-gray-500 font-inter text-xs">
        Now reading: <i>{book.title}</i> by {book.author}.
      </p>
      <a class="text-xs font-inter text-blue-400" href="https://www.goodreads.com/user/show/65474722-jesse" target="_blank" rel="noreferrer noopener">Visit Goodreads profile →</a>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://jessehaenen.me/api/book.py')
  const json = await res.json()

  return {
    props: {
      book: json,
    },
  }
}