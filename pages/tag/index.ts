import { GetStaticProps } from 'next';
import { getTags } from 'resources/tags';
import { TagsViewProps } from 'views/Tag/Tags';

export { default } from 'views/Tag/Tags';

export const getStaticProps: GetStaticProps<TagsViewProps> = async () => {
  const { tags } = await getTags();
  return {
    props: {
      tags,
    },
  };
};
