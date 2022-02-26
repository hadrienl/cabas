import { FC, useEffect } from 'react';

import Box from 'components/Box';
import Main from 'components/Main';
import { useUser } from 'components/UserProvider';
import Nav from './Nav';
import { DistributionsProvider } from 'components/DistributionsProvider';

export const AdminLayout: FC = ({ children }) => {
  const { user, fetchAccess } = useUser();
  useEffect(() => {
    fetchAccess();
  }, [fetchAccess, user]);

  if (!user) return null;

  return (
    <DistributionsProvider>
      <Main padding={0}>
        <Box flexDirection="row" flex="1" alignItems="stretch">
          <Box
            backgroundColor="var(--surface-a)"
            p={3}
            borderRight="1px solid var(--surface-d)"
            minWidth="200px"
            maxWidth="300px"
          >
            <Nav />
          </Box>
          <Box flex="1" alignItems="stretch">
            {children}
          </Box>
        </Box>
      </Main>
    </DistributionsProvider>
  );
};

export default AdminLayout;
