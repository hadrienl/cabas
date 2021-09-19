import supabase from 'lib/supabase';
import { Tag } from './types';

export const getTags = async () => {
  const { data = [], count } = await supabase.from('tag').select('*');

  return {
    tags: (data || []) as Tag[],
    count,
  };
};

export const getTagBySlug = async (slug: string) => {
  const { data } = await supabase
    .from('tag')
    .select('*')
    .eq('slug', slug)
    .single();

  return data;
};
