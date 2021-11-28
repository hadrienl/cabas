import { NextApiRequest, NextApiResponse } from 'next';

import { createUserClient } from '../../../lib/supabase';

export const submit = async (
  { headers: { authorization = '' }, body }: NextApiRequest,
  res: NextApiResponse
) => {
  const supabase = createUserClient(authorization);
  const {
    data: currentBasket,
    error,
    status,
  } = await supabase.from('current_basket').select('*');
  if (error) {
    return res.status(status).send(error);
  }
  if (!currentBasket || currentBasket.length === 0) {
    return res.status(404).send('Basket is empty');
  }
  await supabase.rpc('submit_basket', {
    basket_id: currentBasket[0].id,
  });

  res.send(currentBasket[0]);
};

export default submit;
