import Box from 'components/Box';
import Link from 'components/Link';
import Main from 'components/Main';
import supabase from 'lib/supabase';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';

export const AccountLayout: FC = ({ children }) => {
  const user = supabase.auth.user();
  const { push } = useRouter();

  const signout = async () => {
    await supabase.auth.signOut();
    push('/');
  };

  if (!user) return null;

  return (
    <Main>
      <Box>Settings {user?.email}</Box>
      <Box flexDirection="row">
        <Box>
          <Link href="/account/password">Change password</Link>
          <Box as="button" onClick={signout}>
            Déconnexion
          </Box>
        </Box>
        <Box>{children}</Box>
      </Box>
    </Main>
  );
};

export default AccountLayout;
