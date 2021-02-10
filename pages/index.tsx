import Head from 'next/head';
import Link from 'next/link';
import Box from 'components/Box';
import Header from 'components/Header';
import { Layout } from 'components/Layout';

export default function Home() {
  return (
    <>
      <Head>
        <title>Cabas</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Header />
        <Box>
          <Link href="/signin">Connexion</Link>
        </Box>
        <Box as="footer">Pied</Box>
      </Layout>
    </>
  );
}
