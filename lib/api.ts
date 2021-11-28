import supabase from './supabase';

class ApiError extends Error {
  public code: number;

  constructor(statusCode: number, statusText: string) {
    super();
    this.code = statusCode;
    this.message = statusText;
  }
}
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

    if (res.status < 200 || res.status > 299) {
      throw new ApiError(res.status, res.statusText);
    }

    return await res.json();
  }
}

export default new Api();
