import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Tooltip } from 'primereact/tooltip';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Badge } from 'primereact/badge';

import Box from 'components/Box';
import Text from 'components/Text';
import { useUser } from 'components/UserProvider';
import { User } from 'types/Entities';
import { useTranslation } from 'lib/i18n';
import { useHeader, Link as ILink } from './HeaderProvider';

const getInitials = (user: User) => {
  const { firstName, lastName } = user;

  return `${(firstName || '').substr(0, 1)}${(lastName || '').substr(0, 1)}`;
};

const getDisplayName = (user: User) => {
  if (!user) return '';
  return user.firstName || user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email;
};

export const Header = () => {
  const { t } = useTranslation();
  const { push } = useRouter();
  const { user } = useUser();
  const { breadcrumbs } = useHeader();

  const breadcrumbsWithUser = useMemo(
    () =>
      [
        user && {
          label: t('header.hello', {
            displayName: getDisplayName(user),
          }),
          url: '/account',
        },
        ...(breadcrumbs || []),
      ].filter(Boolean) as ILink[],
    [user, breadcrumbs]
  );

  const navigateAccount = () => {
    push('/account');
  };

  const navigateBasket = () => {
    push('/basket');
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
      boxShadow="0 0 4px rgb(0 0 0 / 25%)"
    >
      <Box flexDirection="row" alignItems="center">
        <Text marginRight="5">
          <Link href="/">{t('title')}</Link>
        </Text>
        {breadcrumbsWithUser && (
          <BreadCrumb
            model={breadcrumbsWithUser.map((item) => ({
              ...item,
              command: ({ originalEvent }) => {
                originalEvent.preventDefault();
                push(item.url);
              },
            }))}
            home={{
              icon: 'pi pi-home',
              url: '/',
              command: ({ originalEvent }: { originalEvent: Event }) => {
                originalEvent.preventDefault();
                push('/');
              },
            }}
          />
        )}
      </Box>
      <Box flexDirection="row">
        {user && (
          <>
            <Tooltip target=".basket-button" position="left" />
            <Box
              onClick={navigateBasket}
              cursor="pointer"
              className="basket-button"
              data-pr-tooltip={t('header.basketLink')}
              mr={3}
            >
              <Avatar
                className="p-overlay-badge"
                image="/static/images/icons/basket.svg"
                size="large"
              >
                {/*<Badge value="499" />*/}
              </Avatar>
            </Box>
            <Tooltip target=".user-button" position="left" />
            <Box
              onClick={navigateAccount}
              cursor="pointer"
              className="user-button"
              data-pr-tooltip={t('header.accountLink')}
            >
              <Avatar
                label={getInitials(user)}
                icon="pi pi-user"
                size="large"
              />
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
