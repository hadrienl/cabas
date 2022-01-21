import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE || ''
);

const stripe = new Stripe(process.env.STRIPE_KEY || '', {
  apiVersion: '2020-08-27',
  typescript: true,
});

const pay = async (
  { query: { session_id, from } }: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await stripe.checkout.sessions.retrieve(`${session_id}`);
  const { amount_total, payment_status, payment_intent, metadata } = session;
  const { orderId } = metadata || {};

  if (payment_status !== 'paid') {
    res.status(402).send('Paiyment failed');
    return;
  }

  const { data: products } = await supabase
    .from('orders')
    .select(`*`)
    .eq('id', orderId);

  if (!products) {
    res.status(404).send('product not found');
    return;
  }
  const total =
    products.reduce(
      (prev, { unit_price, quantity }) => prev + unit_price * quantity,
      0
    ) * 100;

  if ((amount_total || 0) >= total) {
    await supabase
      .from('indent')
      .update({
        status: 'paid',
        paid: amount_total,
        payment_id: payment_intent,
      })
      .eq('id', orderId);
  }

  res.status(301).redirect(`${from}?paid=true`);
};

export default pay;
