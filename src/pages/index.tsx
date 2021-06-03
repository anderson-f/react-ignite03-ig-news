// Tudo dentro desse head vai ser anexado ao head do document
import Head from 'next/head' // posso botar em qualquer lugar da tela

export default function Home() {
  return (
    <>
      <Head>
        <title>ig.news</title>
      </Head>
      <h1>
        Hello world
      </h1>
    </>
  )
}
