import Head from 'next/head';
import { FC } from 'react';
import Footer from './Footer';
import Header from './Header';
import { Layout } from './Layout';

export const Main: FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>Cabas</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout header={<Header />} footer={<Footer />}>
        {children}
      </Layout>
    </>
  );
};

export default Main;
