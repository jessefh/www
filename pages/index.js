import Head from 'next/head'

export default function Home({book}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-tr from-purple-200 via-purple-100 to-purple-50">
      <Head>
        <title>Jesse Haenen</title>
        <link rel="icon" href="/favicon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Madurai&family=Source+Sans+Pro&display=swap" rel="stylesheet"></link>
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

      <main className="flex flex-col items-center justify-center w-full flex-1 px-10 text-center text-gray-700">
        <h1 className="text-7xl sm:text-8xl font-hind font-bold tracking-wide">
          Jesse Haenen
        </h1>

        <p className="text-xl sm:text-2xl font-source mt-2">
          I'm a full-stack data scientist from Amsterdam.
        </p>

        <ul class="flex mt-3 text-gray-500 font-source text-lg">
          <li class="mx-5 border-b-2 border-transparent hover:border-b-2 hover:border-blue-400">
            <a href="mailto:jessehaenen@pm.me">Mail</a>
          </li>
          <li class="mx-5 border-b-2 border-transparent hover:border-b-2 hover:border-blue-400">
            <a href="https://www.linkedin.com/in/jesse-fh/" target="_blank" rel="noreferrer noopener">LinkedIn</a>
          </li>
          <li class="mx-5 border-b-2 border-transparent hover:border-b-2 hover:border-blue-400">
            <a href="https://github.com/jessefh" target="_blank" rel="noreferrer noopener">GitHub</a>
          </li>
          <li class="mx-5 border-b-2 border-transparent hover:border-b-2 hover:hover:border-blue-400">
            <a href="https://www.dropbox.com/s/oumpmllmmbwtu8f/cv_jesse_haenen.pdf?dl=0" target="_blank" rel="noreferrer noopener">CV</a>
          </li>
        </ul>

      <p class="flex mt-12 text-gray-500 font-source text-sm">
        Now reading:&nbsp;{book}. <a class="px-1 font-bold text-blue-400" href="https://www.goodreads.com/user/show/65474722-jesse" target="_blank" rel="noreferrer noopener">Visit Goodreads profile →</a>
      </p>
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch('https://jessehaenen.me/api/book.py')

  return {
    props: {
      book: res,
    },
  }
}