import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import supabase from 'lib/supabase';
import { Customer, OrderBase } from 'types/Entities';
import { Column } from 'primereact/column';
import { useTranslation } from 'lib/i18n';
import Box from 'components/Box';
import OrderDetails from './OrderDetails';
import Button from 'components/Button';
import OrderStatus from './OrderStatus';

type OrderWithCustomer = OrderBase & { customer: Customer };

export const OrdersTable: FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [expanded, setExpanded] = useState<OrderWithCustomer[]>([]);
  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from<OrderWithCustomer>('indent')
      .select(
        `
      id,
      status,
      total,
      customer(
        id,
        firstName: first_name,
        lastName: last_name,
        photo,
        phone
      )
    `
      )
      .neq('status', 'pending');
    if (!data) return;

    setOrders(data);
  }, []);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const data = useMemo(
    () =>
      orders.map(
        ({
          customer: { firstName, lastName, email, phone },
          status,
          ...order
        }) => ({
          ...order,
          firstName,
          lastName,
          email,
          phone,
          status,
          status_label: t('admin.orders.status', { context: status }),
        })
      ),
    [orders, t]
  );

  const validateOrder = useCallback(
    async (id: number) => {
      await supabase.from('indent').update({ status: 'valid' }).eq('id', id);
      setOrders(
        orders.map((order) =>
          order.id === id
            ? {
                ...order,
                status: 'valid',
              }
            : order
        )
      );
    },
    [orders]
  );

  return (
    <DataTable
      value={data}
      expandedRows={expanded}
      rowExpansionTemplate={(props) => <OrderDetails {...props} />}
      onRowToggle={({ data }) => setExpanded(data)}
      sortField="status_label"
      sortOrder={1}
    >
      <Column expander style={{ width: '3em' }} />
      <Column field="status_label" header="Status" sortable filter></Column>
      <Column field="firstName" header="First Name"></Column>
      <Column field="lastName" header="Last Name"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="phone" header="Phone"></Column>
      <Column
        header="Valider ?"
        body={(props) => (
          <OrderStatus {...props} validateOrder={validateOrder} />
        )}
      ></Column>
    </DataTable>
  );
};

export default OrdersTable;
