import supabase from 'lib/supabase';
import Link from 'next/link';
import Box from './Box';

export const Header = () => {
  const user = supabase.auth.user();

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
          <Link href="/account">{user.email}</Link>
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
