import Box from 'components/Box';
import Button from 'components/Button';
import { useDistributions } from 'components/DistributionsProvider/context';
import Link from 'components/Link';
import Text from 'components/Text';
import { useUser } from 'components/UserProvider';
import { useTranslation } from 'lib/i18n';
import useDateFormat from 'lib/useDateFormat';
import { useRouter } from 'next/router';
import { Sidebar } from 'primereact/sidebar';
import { useCallback, useState } from 'react';
import { Distribution } from 'types/Entities';
import EditDistribution from '../EditDistribution';

export const Nav = () => {
  const { t } = useTranslation();
  const [editDistribution, setEditDistribution] = useState<Partial<
    Distribution
  > | null>(null);
  const dateFormat = useDateFormat();
  const { user, fetchAccess, access } = useUser();
  const { distributions } = useDistributions();
  const {
    query: { id },
    route,
    ...props
  } = useRouter();

  const saveDistribution = useCallback((distribution: Distribution) => {
    console.log('save', distribution);
  }, []);

  return (
    <>
      <Text>Catalogue</Text>
      <Link href="/admin/catalog">Editer le catalogue</Link>
      <Text>Distribution</Text>
      <Button onClick={() => setEditDistribution({})}>
        Créer une distribution
      </Button>
      {distributions.map((distribution) => (
        <Box key={distribution.id} mb="4">
          <Button py="2" onClick={() => setEditDistribution(distribution)}>
            <Box className="pi pi-shopping-cart" mr={3} />
            {t('admin.distributions.title', {
              date: dateFormat(distribution.startAt),
            })}
          </Button>
          <Box ml="4">
            <Link
              href={`/admin/distribution/${distribution.id}/products`}
              flexDirection="row"
              alignItems="center"
            >
              <Box className="pi pi-shopping-bag" mr={3} />
              <Text py={2}>{t('admin.distributions.products')}</Text>
            </Link>
          </Box>
          {access.orders && (
            <Box ml="4">
              <Link
                href={`/admin/distribution/${distribution.id}/orders`}
                flexDirection="row"
                alignItems="center"
              >
                <Box className="pi pi-euro" mr={3} />
                <Text py={2}>{t('admin.distributions.orders')}</Text>
              </Link>
            </Box>
          )}
        </Box>
      ))}
      <Sidebar
        visible={!!editDistribution}
        onHide={() => setEditDistribution(null)}
        position="right"
      >
        <EditDistribution
          distribution={editDistribution || {}}
          onSubmit={saveDistribution}
        />
      </Sidebar>
    </>
  );
};

export default Nav;
