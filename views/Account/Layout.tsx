import { FC, MouseEvent, useEffect } from 'react';
import { useRouter } from 'next/router';

import Box from 'components/Box';
import Text from 'components/Text';
import Link from 'components/Link';
import Main from 'components/Main';
import { useUser } from 'components/UserProvider';
import { useHeader, Link as ILink } from 'components/Header/HeaderProvider';
import { useTranslation } from 'lib/i18n';

interface AccountLayoutProps {
  breadcrumbs?: ILink[];
}

export const AccountLayout: FC<AccountLayoutProps> = ({
  children,
  breadcrumbs = [],
}) => {
  const { t } = useTranslation();
  const { user, signout } = useUser();
  const { push } = useRouter();
  const { setBreadcrumbs } = useHeader();

  const signOut = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    signout();
    push('/');
  };

  useEffect(() => {
    if (!user) return;
    setBreadcrumbs([
      {
        label: t('account.title'),
        url: '/account',
      },
      ...breadcrumbs,
    ]);

    return () => {
      setBreadcrumbs([]);
    };
  }, []);

  if (!user) return null;

  return (
    <Main padding={0}>
      <Box flexDirection="row" flex="1" alignItems="stretch">
        <Box
          backgroundColor="var(--surface-a)"
          p={3}
          borderRight="1px solid var(--surface-d)"
          minWidth="200px"
          maxWidth="300px"
        >
          <Link
            href="/account/password"
            flexDirection="row"
            alignItems="center"
          >
            <Box className="pi pi-lock" mr={3} />
            <Text py={3}>{t('account.password.title')}</Text>
          </Link>
          <Text
            onClick={signOut}
            py={3}
            as="a"
            href="/signout"
            flexDirection="row"
            alignItems="center"
          >
            <Box className="pi pi-sign-out" mr={3} />
            {t('account.signout')}
          </Text>
        </Box>
        <Box p={3} flex="1" alignItems="stretch">
          {children}
        </Box>
      </Box>
    </Main>
  );
};

export default AccountLayout;
