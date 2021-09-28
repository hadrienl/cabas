import { FC } from 'react';
import { useRouter } from 'next/router';

import Main from 'components/Main';

export const Loading: FC = ({ children }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <Main>Wait for it</Main>;
  }
  return <>{children}</>;
};

export default Loading;
