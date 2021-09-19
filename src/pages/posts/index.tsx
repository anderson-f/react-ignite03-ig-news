import Head from 'next/head';
import React from 'react'
import styles from './styles.module.scss'

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with leana & Yarn Workspaces</strong>
            <p>In this guide, you will learn ho to create a Monorepo to manaeg multiple packages with a shage dsadsadas</p>
          </a>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with leana & Yarn Workspaces</strong>
            <p>In this guide, you will learn ho to create a Monorepo to manaeg multiple packages with a shage dsadsadas</p>
          </a>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with leana & Yarn Workspaces</strong>
            <p>In this guide, you will learn ho to create a Monorepo to manaeg multiple packages with a shage dsadsadas</p>
          </a>
        </div>
      </main>
    </>
  );
}
