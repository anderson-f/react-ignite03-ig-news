import { GetStaticProps } from 'next'

// Tudo dentro desse head vai ser anexado ao head do document
import Head from 'next/head' // posso botar em qualquer lugar da tela
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

// Client-side - não precisa de indexação/ação do usuário/sem necessidade de já ter a informação
// Server-side - tempo real
// Static Site Generation - informações fixas

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

/* getServerSideProps GetServerSideProps */
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IycKOBVg5kZNibMGUHrA73M', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
