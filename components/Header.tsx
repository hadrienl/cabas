import supabase from 'lib/supabase';
import Link from 'components/Link';
import Box from './Box';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export const Header = () => {
  const [user, setUser] = useState<User | null>();
  useEffect(() => {
    const user = supabase.auth.user();
    setUser(user);
  }, []);

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      alignSelf="stretch"
      marginY="10px"
    >
      <Box as="h1">
        <Link href="/">Cabas</Link>
      </Box>
      {user && (
        <Box>
          <Link href="/account">{user.email || ''}</Link>
        </Box>
      )}
      {!user && (
        <Box>
          <Link href="/signin">Connexion</Link>
        </Box>
      )}
    </Box>
  );
};

export default Header;
