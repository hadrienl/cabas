import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Tooltip } from 'primereact/tooltip';
import { withTranslation } from 'next-i18next';
import Box from './Box';
import Text from './Text';
import { useUser } from './UserProvider';
import { User } from 'types/Entities';
import { useTranslation } from 'lib/i18n';

const getInitials = (user: User) => {
  const { firstName = '', lastName = '' } = user;

  return `${firstName.substr(0, 1)}${lastName.substr(0, 1)}`;
};

export const Header = () => {
  const { t } = useTranslation();
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
        <Link href="/">{t('title')}</Link>
      </Text>
      <Box flexDirection="row">
        {user && (
          <>
            <Tooltip target=".user-button" position="left" />
            <Box
              onClick={navigateAccount}
              cursor="pointer"
              className="user-button"
              data-pr-tooltip={t('header.accountLink')}
            >
              <Avatar label={getInitials(user)} icon="pi pi-user" />
            </Box>
          </>
        )}
        {user === null && (
          <Link href="/signin">
            <Button
              icon="pi pi-sign-in"
              tooltip={t('header.connectionLink')}
              tooltipOptions={{ position: 'left' }}
            />
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default Header;
