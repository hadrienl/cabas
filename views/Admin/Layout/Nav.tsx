import Box from 'components/Box';
import { useDistributions } from 'components/DistributionsProvider/context';
import Link from 'components/Link';
import Text from 'components/Text';
import { useUser } from 'components/UserProvider';
import { useTranslation } from 'lib/i18n';
import useDateFormat from 'lib/useDateFormat';
import { useRouter } from 'next/router';

export const Nav = () => {
  const { t } = useTranslation();
  const dateFormat = useDateFormat();
  const { user, fetchAccess, access } = useUser();
  const { distributions } = useDistributions();
  const {
    query: { id },
    route,
    ...props
  } = useRouter();
  console.log(route, id, props);

  return (
    <>
      {distributions.map(({ id, startAt, shipAt, closeAt }) => (
        <Box key={id} mb="4">
          <Text py="2">
            <Box className="pi pi-shopping-cart" mr={3} />
            {t('admin.distributions.title', {
              date: dateFormat(startAt),
            })}
          </Text>
          <Box ml="4">
            <Link
              href={`/admin/distribution/${id}/products`}
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
                href={`/admin/distribution/${id}/orders`}
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
    </>
  );
};

export default Nav;
