import supabase from './supabase';

export class Api {
  async fetch(input: RequestInfo, init?: any) {
    const auth = supabase.auth.session();
    if (!auth) {
      throw new Error('Auth session not found');
    }
    const res = await fetch(input, {
      ...init,
      headers: {
        authorization: auth.access_token,
      },
      body:
        init &&
        init.body &&
        (typeof init.body === 'object' ? JSON.stringify(init.body) : init.body),
    });

  }
}

export default new Api();
