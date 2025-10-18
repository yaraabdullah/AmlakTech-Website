import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>AmlakTech - Coming Soon</title>
        <meta name="description" content="AmlakTech website - Under construction" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Welcome to AmlakTech
          </h1>
          <p className={styles.description}>
            Website under construction. Figma design integration coming soon.
          </p>
        </div>
      </main>
    </>
  )
}
