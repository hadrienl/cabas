import Link from 'next/link';

import Box from 'components/Box';
import Main from 'components/Main';
import Marketplace from 'components/Marketplace';
import { useUser } from 'components/UserProvider';

export default function Home() {
  const { user } = useUser();

  return (
    <Main>
      {!user && <Link href="/signin">Connexion</Link>}
      {user && (
        <>
          <Box>
            Bonjour {user.firstName} {user.lastName}
          </Box>
          <Marketplace />
        </>
      )}
    </Main>
  );
}
