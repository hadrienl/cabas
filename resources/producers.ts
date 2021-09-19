import supabase from 'lib/supabase';
import { Producer } from './types';

export const getProducers = async () => {
  const { data = [], count } = await supabase.from('producer').select(`*`);

  return {
    producers: (data || []) as Producer[],
    count,
  };
};

export const getProducerById = async (id: string) => {
  const { data = [] } = await supabase
    .from('producer')
    .select(`*`)
    .eq('id', id)
    .single();

  if (!data) {
    throw new Error('not found');
  }

  return data as Producer;
};
