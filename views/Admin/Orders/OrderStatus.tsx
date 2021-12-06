import Text from 'components/Text';
import supabase from 'lib/supabase';
import { Button } from 'primereact/button';
import { FC, useCallback, useState } from 'react';
import { Order } from 'types/Entities';

interface OrderStatusProps extends Order {
  validateOrder: (id: number) => Promise<void>;
}
export const OrderStatus: FC<OrderStatusProps> = ({
  id,
  status,
  validateOrder,
}) => {
  const [loading, setLoading] = useState(false);
  const ship = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    await validateOrder(id);
    setLoading(false);
  }, [id, validateOrder]);
  switch (status) {
    case 'paid':
      return (
        <Button disabled={loading} onClick={ship}>
          Valider
        </Button>
      );
    case 'valid':
      return <Text>À livrer</Text>;
  }
  return null;
};

export default OrderStatus;
