import { FC } from 'react';
import Image from 'next/image';

import Box from 'components/Box';
import { Product } from 'resources/types';
import Text from 'components/Text';

import { useTranslation } from 'lib/i18n';
import CardContainer from './CardContainer';
import AddToBasket from 'components/AddToBasket';
import Link from 'components/Link';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  product: { id, name, photo, price, unit, producer, tag, isBuyable },
}) => {
  const {
    t,
    i18next: { language },
  } = useTranslation();

  return (
    <CardContainer>
      <Text
        flexDirection="row"
        justifyContent="space-between"
        margin={2}
        mb={producer ? 1 : 2}
      >
        <Link href={`/product/${id}-${name}`}>{name}</Link>
        {tag && <Link href={`/tag/${tag.slug}`}>{tag.name}</Link>}
      </Text>
      {producer && (
        <Link
          href={`/producer/${producer.id}-${producer.name}`}
          fontSize={0}
          marginX={2}
          mt={1}
          mb={2}
        >
          {t('distributions.product.producedBy', { name: producer.name })}
        </Link>
      )}
      <Link
        href={`/product/${id}-${name}`}
        maxHeight="200px"
        overflow="hidden"
        justifyContent="center"
      >
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={name} width="100%" />
        )}
        {!photo && <Box height="200px" />}
      </Link>
      <Box flexDirection="row" justifyContent="space-between" mt={4}>
        <AddToBasket product={product} />
      </Box>
    </CardContainer>
  );
};

export default ProductCard;
