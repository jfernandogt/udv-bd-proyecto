import Head from 'next/head'
import { Inter } from 'next/font/google'

import { getAuthServerSideProps } from '@/utils/getAuthServerSideProps'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Universidad Da Vinci de Guatemala - Proyecto Fase 1</h1>
      <h2>Integrantes:</h2>
      <ul>
        <li>Francis Alejandra Rivera González - 202100884</li>
        <li>Juan Fernando Barrios Barrera - 202102655</li>
        <li>Gustavo Adolfo Pérez Canú - 202104862</li>
      </ul>
    </>
  )
}

export const getServerSideProps = getAuthServerSideProps