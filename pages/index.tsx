import Head from 'next/head';
import Box from './components/Box';

export default function Home() {
  return (
    <Box justifyContent="center" alignItems="center" flex="1" minHeight="100vh">
      <Head>
        <title>Cabas</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="main">
        <p>Cabas</p>
      </Box>

      <Box as="footer"></Box>
    </Box>
  );
}
