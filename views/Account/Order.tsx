import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import Box from 'components/Box';
import { useTranslation } from 'lib/i18n';
import supabase from 'lib/supabase';
import { Order, OrderBase } from 'types/Entities';
import AccountLayout from './Layout';
import Loading from 'components/Loading';
import Text from 'components/Text';
import { Link } from 'components/Header/HeaderProvider';

export interface OrderProps {
  order: Order;
}

export const OrderContent: FC<OrderProps> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text as="h1">
        {t('account.order.title', {
          context: order.status,
          date: order.updatedAt && new Date(order.updatedAt),
        })}
      </Text>
      <Text>
        Status: {t('account.order.status', { context: order.status })}
      </Text>
      {order.status === 'submitted' && (
        <Box>
          <Text>{t('account.order.payment')}</Text>
        </Box>
      )}
      <table>
        <thead></thead>
        <tbody>
          {(order.products || []).map(({ id, name, quantity, price }) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{quantity}</td>
              <td>{price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export const OrderView: FC<OrderProps> = (props) => {
  const { t } = useTranslation();
  const {
    query: { id: orderId },
    replace,
  } = useRouter();
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(true);
  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    const { data: order } = await supabase
      .from<
        OrderBase & {
          products: {
            id: number;
            quantity: number;
            unit_price: number;
            product_in_distribution: {
              unit: number;
              unit_label: string;
              per_unit: number;
              price: number;
              product: {
                name: string;
                description: string;
                photo: string;
              };
            };
          }[];
        }
      >('indent')
      .select(
        `
        id,
        status,
        total,
        updatedAt: updated_at,
        products: product_in_indent(
          *,
          product_in_distribution(*, product(*))
        )`
      )
      .eq('id', +orderId)
      .single();
    console.log('order', order);
    if (!order) {
      setLoading(false);
      return;
    }
    setOrder({
      ...order,
      products: order.products.map(
        ({
          product_in_distribution: {
            unit,
            unit_label: unitLabel,
            per_unit: perUnit,
            price,
            product: productDetails,
          },
          ...product
        }) => ({
          ...product,
          unit,
          unitLabel,
          perUnit,
          price,
          ...productDetails,
        })
      ),
    });
    setLoading(false);
  }, [orderId]);
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const breadcrumbs = useMemo(
    () =>
      [
        {
          label: t('account.orders.title'),
          url: '/account/orders',
        },
        order && {
          label: t('account.order.title', {
            context: 'short',
            date: order.updatedAt,
          }),
          url: `/account/order/${order.id}`,
        },
      ].filter(Boolean) as Link[],
    [t, order]
  );

  if (!loading && !order) {
    replace('/account/orders');
  }

  return (
    <AccountLayout breadcrumbs={breadcrumbs}>
      {loading && <Loading />}
      {order && <OrderContent {...props} order={order} />}
    </AccountLayout>
  );
};

export default OrderView;