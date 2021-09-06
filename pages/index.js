import Head from 'next/head'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-tr from-purple-200 via-purple-100 to-purple-50">
      <Head>
        <title>jesse haenen</title>
        <link rel="icon" href="/favicon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Madurai&family=Source+Sans+Pro&display=swap" rel="stylesheet"></link>
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-10 text-center text-gray-700">
        <h1 className="text-7xl sm:text-8xl font-hind font-bold">
          Jesse Haenen
        </h1>

        <p className="text-xl sm:text-2xl font-source mt-3">
          I'm a full-stack data scientist from Amsterdam.
        </p>

        <ul class="flex mt-9 text-gray-500 font-source">
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
      </main>
    </div>
  )
}
