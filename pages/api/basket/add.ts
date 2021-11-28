import { NextApiRequest, NextApiResponse } from 'next';
import { createUserClient } from '../../../lib/supabase';

export const add = async (
  { headers: { authorization = '' }, body }: NextApiRequest,
  res: NextApiResponse
) => {
  // const a = api.fetch('/api/basket/add', {
  //   method: 'post',
  //   body: {
  //     product_id: id,
  //     quantity: count,
  //   },
  // });
  // console.log(a);
  // const supabase = createUserClient(authorization);
  // const { data: currentBasket, error, status } = await supabase
  //   .from('current_basket')
  //   .select('*');
  // if (error) {
  //   return res.status(status).send(error);
  // }
  // if (currentBasket.length === 0) {
  //   // Create a new basket
  //   const basket = await supabase.from('indent').insert({
  //   })
  // }
  // res.send(data);
};

export default add;
