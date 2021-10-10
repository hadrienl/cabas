import supabase from 'lib/supabase';
import { GetStaticProps } from 'next';
import { Tag } from 'types/Entities';
import { TagsViewProps } from 'views/Tag/Tags';

export { default } from 'views/Tag/Tags';

export const getStaticProps: GetStaticProps<TagsViewProps> = async () => {
  const { data } = await supabase.from<Tag>('tag').select('id, slug, name');
  return {
    props: {
      tags: data || [],
    },
  };
};
