import { FC, useCallback, useEffect, useState } from 'react';

import Text from 'components/Text';
import { useTranslation } from 'lib/i18n';
import Layout from '../Layout';
import { Distribution } from 'types/Entities';
import supabase from 'lib/supabase';
import OrdersTable from './OrdersTable';

export const OrdersView: FC = () => {
  const { t } = useTranslation();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const fetchDistributions = useCallback(async () => {
    const { data } = await supabase.from('distribution').select(`
      id,
      startAt: start_at,
      closeAt: close_at,
      shipAt: ship_at
    `);
    if (!data) {
      setDistributions([]);
      return;
    }

    setDistributions(data);
  }, []);

  useEffect(() => {
    fetchDistributions();
  }, [fetchDistributions]);

  const now = new Date();

  const currentDistribution = distributions.find(
    ({ startAt, closeAt }) => new Date(startAt) < now && new Date(closeAt) > now
  );

  return (
    <Layout>
      <Text as="h1">{t('admin.orders.title')}</Text>
      {currentDistribution && (
        <Text as="h2">
          {t('admin.orders.currentDistribution', {
            startAt: currentDistribution.startAt,
            closeAt: currentDistribution.closeAt,
          })}
        </Text>
      )}
      <OrdersTable />
    </Layout>
  );
};

export default OrdersView;
