import Head from 'next/head';
import { FC } from 'react';
import Box from './Box';
import Header from './Header';
import { Layout } from './Layout';

export const Main: FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>Cabas</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Header />
        {children}
        <Box as="footer">Pied</Box>
      </Layout>
    </>
  );
};

export default Main;
