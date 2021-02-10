import Link from 'next/link';

import Box from 'components/Box';
import supabase from 'lib/supabase';
import Main from 'components/Main';

export default function Home() {
  const user = supabase.auth.user();

  return (
    <Main>
      {!user && <Link href="/signin">Connexion</Link>}
      {user && <Box>Bonjour {user.email}</Box>}
    </Main>
  );
}
