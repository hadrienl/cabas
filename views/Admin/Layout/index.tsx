import { ReactElement } from 'react';
import Layout from './Layout';
export default Layout;

export const getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
