import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';

import Box from 'components/Box';
import Link from 'components/Link';
import Main from 'components/Main';
import { useUser } from 'components/UserProvider';
import SectionTitle from 'components/SectionTitle';
import { useHeader, Link as ILink } from 'components/Header/HeaderProvider';
import { useTranslation } from 'lib/i18n';
import { User } from 'types/Entities';

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

  const signOut = async () => {
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
    <Main>
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
