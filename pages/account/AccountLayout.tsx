import { FC, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

import Box from 'components/Box';
import Link from 'components/Link';
import Main from 'components/Main';
import supabase from 'lib/supabase';
import { useUser } from 'components/UserProvider';

export const AccountLayout: FC = ({ children }) => {
  const { user, signout } = useUser();
  const { push } = useRouter();

  const signOut = async () => {
    signout();
    push('/');
  };

  if (!user) return null;

  return (
    <Main>
      <Box>Settings {user?.email}</Box>
      <Box flexDirection="row">
        <Box>
          <Link href="/account/password">Change password</Link>
          <Box as="button" onClick={signOut}>
            Déconnexion
          </Box>
        </Box>
        <Box>{children}</Box>
      </Box>
    </Main>
  );
};

export default AccountLayout;
