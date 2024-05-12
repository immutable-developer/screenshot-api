import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Clique Capital API Service
          </div>
          <a
            href="https://cliquecapital.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-blue-500 hover:text-blue-600"
          >
            Click here to visit the Clique Capital website.
          </a>
        </div>
      </main>
    </>
  );
}
