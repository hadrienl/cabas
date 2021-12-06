import { createClient } from '@supabase/supabase-js';

export const createUserClient = (token: string) => {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
  );
  client.auth.setAuth(token);

  return client;
};

export default createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
);
