import { FC } from 'react';
import slug from 'slug';

import Box from 'components/Box';
import {
  Distribution,
  Product,
  ProductInDistribution,
  ProductWithDistributions,
} from 'types/Entities';
import Text from 'components/Text';

import { useTranslation } from 'lib/i18n';
import CardContainer from './CardContainer';
import AddToBasket from 'components/AddToBasket';
import Link from 'components/Link';

interface ProductCardProps
  extends Pick<Product, 'id' | 'name' | 'photo' | 'producer' | 'tag'> {
  canBuy?: ProductWithDistributions['distributions'][0];
  link?: string;
}

export const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  photo,
  producer,
  tag,
  canBuy,
  link = `/product/${id}-${slug(name)}`,
}) => {
  const { t } = useTranslation();

  return (
    <CardContainer>
      <Text
        flexDirection="row"
        justifyContent="space-between"
        margin={2}
        mb={producer ? 1 : 2}
      >
        <Link href={link}>{name}</Link>
        {tag && <Link href={`/tag/${tag.slug}`}>{tag.name}</Link>}
      </Text>
      {producer && (
        <Link
          href={`/producer/${producer.id}-${slug(producer.name)}`}
          fontSize={0}
          marginX={2}
          mt={1}
          mb={2}
        >
          {t('product.producedBy', { name: producer.name })}
        </Link>
      )}
      <Link
        href={link}
        maxHeight="200px"
        overflow="hidden"
        justifyContent="center"
      >
        {photo && <Box as="img" src={photo} alt={name} width="100%" />}
        {!photo && <Box height="200px" />}
      </Link>
      <Box flexDirection="row" justifyContent="space-between" mt={4}>
        {canBuy && (
          <AddToBasket id={id} unit={canBuy.unit} price={canBuy.price} />
        )}
      </Box>
    </CardContainer>
  );
};

export default ProductCard;
