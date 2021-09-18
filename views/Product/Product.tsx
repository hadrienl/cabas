import { FC, useEffect } from 'react';

import Box from 'components/Box';
import { Link as ILink, useHeader } from 'components/Header/HeaderProvider';
import Main from 'components/Main';
import Markdown from 'components/Markdown';
import Text from 'components/Text';
import { useTranslation } from 'lib/i18n';
import { Product } from 'resources/types';
import AddToBasket from 'components/AddToBasket';
import Link from 'components/Link';

export interface ProductViewProps {
  product: Product;
}

export const ProductView: FC<ProductViewProps> = ({
  product,
  product: { id, name, description, photo, tag, producer },
}) => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useHeader();
  useEffect(() => {
    setBreadcrumbs(
      [
        { url: '/product', label: t('product.title') },
        producer && {
          url: `/producer/${producer.id}-${producer.name}`,
          label: producer.name,
        },
        {
          url: `/product/${id}-${name}`,
          label: name,
        },
      ].filter(Boolean) as ILink[]
    );

    return () => setBreadcrumbs(null);
  }, [producer, id, name, t, setBreadcrumbs]);

  return (
    <Main>
      <Box flexDirection="row" justifyContent="space-between">
        <Text as="h1">{name}</Text>
        {tag && <Link href={`/tag/${tag.slug}`}>{tag.name}</Link>}
      </Box>
      <Box flexDirection="row" my={4}>
        {photo && (
          <Box mr={2} width="40%">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Box
              as="img"
              src={photo}
              alt={name}
              width="100%"
              alignSelf="start"
            />
          </Box>
        )}
        <Box ml={photo ? 2 : 0} flex="1">
          <Markdown flex="1">{description}</Markdown>
          <AddToBasket product={product} />
        </Box>
      </Box>
    </Main>
  );
};

export default ProductView;
