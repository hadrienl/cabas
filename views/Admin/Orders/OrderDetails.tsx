import { equal } from 'assert';
import Box from 'components/Box';
import supabase from 'lib/supabase';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FC, useCallback, useEffect, useState } from 'react';
import { Order, OrderProduct, ProductInBasket } from 'types/Entities';

export const OrderDetails: FC<Order> = (order) => {
  const [loading, setLoading] = useState(true);
  const [fullOrder, setOrder] = useState<Order | null>();

  const fetchOrder = useCallback(
    async (id) => {
      setLoading(true);
      const { data } = await supabase
        .from<OrderProduct>('orders')
        .select(
          `id,
          name: product_name,
          photo: product_photo,
          description: product_description,
          unitPrice: unit_price,
          price,
          quantity
    `
        )
        .eq('id', id);

      setOrder({
        ...order,
        products: data || [],
      });
      setLoading(false);
    },
    [order]
  );

  useEffect(() => {
    fetchOrder(order.id);
  }, [fetchOrder, order]);
  return (
    <DataTable
      lazy
      value={fullOrder ? fullOrder.products : []}
      loading={loading}
    >
      <Column field="name" header="Product"></Column>
      <Column field="unitPrice" header="Prix unitaire"></Column>
      <Column field="quantity" header="Quantité"></Column>
      <Column field="price" header="Total"></Column>
    </DataTable>
  );
};

export default OrderDetails;
