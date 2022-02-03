import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUserClient } from 'lib/supabase';
import i18n from 'lib/i18n';

const stripe = new Stripe(process.env.STRIPE_KEY || '', {
  apiVersion: '2020-08-27',
  typescript: true,
});

const pay = async (
  {
    query: { orderId, from = '' },
    headers: { authorization = '' },
  }: NextApiRequest,
  res: NextApiResponse
) => {
  if (!authorization) return res.status(401).send('token is mandatory');
  const supabaseClient = createUserClient(`${authorization}`);

  const { data: products } = await supabaseClient
    .from('orders')
    .select(`*`)
    .eq('id', orderId);

  if (!products) return res.status(401).send('order not found');

  const lineItems = products.map(({ product_name, quantity, unit_price }) => {
    return {
      price_data: {
        currency: 'eur',
        product_data: {
          name: product_name,
        },
        unit_amount: unit_price * 100,
      },
      quantity,
    };
  });
  const total = lineItems.reduce(
    (prev, { price_data: { unit_amount }, quantity }) =>
      prev + unit_amount * quantity,
    0
  );

  lineItems.push({
    price_data: {
      currency: 'eur',
      product_data: {
        name: i18n.t('account.order.charges'),
      },
      unit_amount: Math.ceil(total * 0.014) + 25,
    },
    quantity: 1,
  });

  const session = await stripe.checkout.sessions.create({
    metadata: {
      orderId: `${orderId}`,
    },
    line_items: lineItems,
    mode: 'payment',
    locale: 'fr',
    success_url: `${process.env.NEXT_PUBLIC_API_HOST}/api/pay/${orderId}/success?from=${from}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${from}`,
  });

  if (session.url) {
    res.send({ url: session.url });
    return;
  }
  res.status(500).send('Unknown error');
};

export default pay;
