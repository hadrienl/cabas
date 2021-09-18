import Box from 'components/Box';
import { useHeader } from 'components/Header/HeaderProvider';
import Link from 'components/Link';
import Main from 'components/Main';
import Text from 'components/Text';
import { useTranslation } from 'lib/i18n';
import { FC, useEffect } from 'react';
import { Tag } from 'resources/types';

export interface TagsViewProps {
  tags: Tag[];
}
export const TagsView: FC<TagsViewProps> = ({ tags }) => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useHeader();
  useEffect(() => {
    setBreadcrumbs([{ url: '/tag', label: t('tag.title') }]);

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, t]);

  return (
    <Main>
      <Text as="h1">{t('tag.title')}</Text>
      <Box my={4} as="ul">
        {tags.map(({ slug, name }) => (
          <Box key={slug} as="li">
            <Link href={`/tag/${slug}`}>{name}</Link>
          </Box>
        ))}
      </Box>
    </Main>
  );
};

export default TagsView;
