import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import Box from 'components/Box';
import { useTranslation } from 'lib/i18n';
import supabase from 'lib/supabase';
import { Order, OrderBase } from 'types/Entities';
import AccountLayout from './Layout';
import Loading from 'components/Loading';
import Text from 'components/Text';
import Link from 'components/Link';

export interface OrderProps {
  orders: Order[];
}

const statusIcon = (status: Order['status']) => {
  switch (status) {
    case 'submitted':
      return 'money-bill';
    case 'paid':
      return 'clock';
    case 'valid':
      return 'check-circle';
    case 'shipped':
      return 'thumbs-up';
  }
};
export const OrdersContent: FC<OrderProps> = ({ orders }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text as="h1">{t('account.orders.title')}</Text>
      {orders.map(({ id, updatedAt, status }) => (
        <Link
          key={id}
          href={`orders/${id}`}
          flexDirection="row"
          alignItems="center"
        >
          <Box className={`pi pi-${statusIcon(status)}`} mr={2} />
          {t('account.order.title', { context: status, date: updatedAt })}
        </Link>
      ))}
    </Box>
  );
};

export const OrdersView: FC<OrderProps> = (props) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchOrders = useCallback(async () => {
    const { data: orders } = await supabase
      .from<
        OrderBase & {
          updated_at: string;
        }
      >('indent')
      .select(
        `
        id,
        status,
        total,
        updatedAt: updated_at`
      )
      .order('updated_at', { ascending: false });

    if (!orders) {
      setLoading(false);
      return;
    }
    setOrders(orders);
    setLoading(false);
  }, []);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const breadcrumbs = useMemo(
    () => [
      {
        label: t('account.orders.title'),
        url: '/account/orders',
      },
    ],
    [t]
  );

  return (
    <AccountLayout breadcrumbs={breadcrumbs}>
      {loading && <Loading />}
      {orders && <OrdersContent {...props} orders={orders} />}
    </AccountLayout>
  );
};

export default OrdersView;
