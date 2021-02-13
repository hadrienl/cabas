import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Tooltip } from 'primereact/tooltip';

import Box from './Box';
import Text from './Text';
import { useUser } from './UserProvider';
import { User } from 'types/Entities';

const getInitials = (user: User) => {
  const { firstName = '', lastName = '' } = user;

  return `${firstName.substr(0, 1)}${lastName.substr(0, 1)}`;
};

export const Header = () => {
  const { push } = useRouter();
  const { user } = useUser();

  const navigateAccount = () => {
    push('/account');
  };

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      alignSelf="stretch"
      padding="3"
      backgroundColor="var(--surface-a)"
      color="var(--text-color)"
      borderBottom="1px solid var(--surface-d)"
    >
      <Text>
        <Link href="/">Cabas</Link>
      </Text>
      <Box flexDirection="row">
        {user && (
          <>
            <Tooltip target=".user-button" position="left" />
            <Box
              onClick={navigateAccount}
              cursor="pointer"
              className="user-button"
              data-pr-tooltip="Votre compte"
            >
              <Avatar label={getInitials(user)} icon="pi pi-user" />
            </Box>
          </>
        )}
        {user === null && (
          <Button
            icon="pi pi-sign-in"
            tooltip="Connexion"
            tooltipOptions={{ position: 'left' }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Header;
