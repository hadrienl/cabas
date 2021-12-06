import { FC, useEffect } from 'react';

import Box from 'components/Box';
import Text from 'components/Text';
import Link from 'components/Link';
import Main from 'components/Main';
import { useUser } from 'components/UserProvider';
import { useTranslation } from 'lib/i18n';

export const AdminLayout: FC = ({ children }) => {
  const { t } = useTranslation();
  const { user, fetchAccess, access } = useUser();

  useEffect(() => {
    fetchAccess();
  }, [fetchAccess, user]);

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
          {access.orders && (
            <Link href="/admin/orders" flexDirection="row" alignItems="center">
              <Box className="pi pi-shopping-bag" mr={3} />
              <Text py={3}>{t('admin.orders.title')}</Text>
            </Link>
          )}
        </Box>
        <Box p={3} flex="1" alignItems="stretch">
          {children}
        </Box>
      </Box>
    </Main>
  );
};

export default AdminLayout;
