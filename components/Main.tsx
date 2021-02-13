import Head from 'next/head';
import { FC } from 'react';
import Footer from './Footer';
import Header from './Header';
import { Layout, LayoutProps } from './Layout';

export const Main: FC<Omit<LayoutProps, 'header' | 'footer'>> = ({
  children,
  ...props
}) => {
  return (
    <>
      <Head>
        <title>Cabas</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout header={<Header />} footer={<Footer />} {...props}>
        {children}
      </Layout>
    </>
  );
};

export default Main;
