import Head from 'next/head';
import Box from 'components/Box';
import { Layout } from 'components/Layout';
import Header from 'components/Header';

export default function Signin() {
  return (
    <>
      <Head>
        <title>Cabas</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Header />
        <Box>Signin</Box>
        <Box as="footer">Pied</Box>
      </Layout>
    </>
  );
}
