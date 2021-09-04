import Head from 'next/head'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>jesse haenen</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          hi, i'm jesse haenen
        </h1>

        <p className="mt-3 text-2xl">
          i'm a data scientist from amsterdam
        </p>
      </main>
    </div>
  )
}
