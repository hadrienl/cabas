import supabase from 'lib/supabase';
import { GetStaticProps } from 'next';

import { TagsViewProps } from 'views/Tag/Tags';
import { Tag } from 'types/Entities';

export { default } from 'views/Tag/Tags';

export const getStaticProps: GetStaticProps<
  TagsViewProps,
  { id: string; slug: string }
> = async ({ params: { id = '', slug = '' } = {} }) => {
  try {
    const { data: tags } = await supabase.from<Tag>('tag').select(
      `id,
        slug,
        name`
    );

    return {
      props: {
        tags: tags || [],
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
