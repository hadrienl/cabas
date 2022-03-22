import { decode } from 'base64-arraybuffer';
import { Producer } from 'types/Entities';
import supabase from './supabase';
import sha from 'sha1';

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

  getCheckoutUrl(orderId: number) {
    return this.fetch(`/api/pay/${orderId}?from=${window.location}`);
  }

  async uploadPhoto(photo?: string) {
    if (!photo) return null;
    const name = sha(photo);
    const [, mime, base64] = photo.split(/[:;]/);
    const imgData = base64.replace(/^base64,/, '');
    const [, ext] = mime.split(/\//);
    const { data } = await supabase.storage
      .from('images')
      .upload(`${name}.${ext}`, decode(imgData), {
        contentType: mime,
        upsert: true,
      });
    if (!data) return null;
    const { publicURL } = await supabase.storage
      .from('images')
      .getPublicUrl(data.Key.replace(/^images\//, ''));
    return publicURL;
  }

  async saveProducer({ photo, id, ...producer }: Producer) {
    let producerId = id;
    if (!producerId) {
      const producerResponse = await supabase.from('producer').upsert(producer);
      if (producerResponse.error) {
        throw producerResponse.error;
      }
      if (!producerResponse.data || !producerResponse.data[0]) {
        return null;
      }
      producerId = producerResponse.data[0].id;
    }

    const isBase64 = !photo || !`${photo}`.match(/^http/);
    const photoUrl = isBase64 ? await this.uploadPhoto(photo) : photo;

    const newProducerResponse = await supabase
      .from('producer')
      .update({
        ...producer,
        photo: photoUrl,
      })
      .eq('id', producerId);

    if (newProducerResponse.error) {
      throw newProducerResponse.error;
    }
    if (!newProducerResponse.data || !newProducerResponse.data[0]) {
      return null;
    }
    return newProducerResponse.data[0];
  }
}

export default new Api();
