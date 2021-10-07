import { FC, useEffect, useMemo } from 'react';

import Box from 'components/Box';
import { Link as ILink, useHeader } from 'components/Header/HeaderProvider';
import Main from 'components/Main';
import Markdown from 'components/Markdown';
import Text from 'components/Text';
import { useTranslation } from 'lib/i18n';
import {
  Distribution,
  Product,
  ProductInDistribution,
  ProductUnit,
} from 'types/Entities';
import AddToBasket from 'components/AddToBasket';
import Link from 'components/Link';
import { useDateFormat } from 'lib/useDateFormat';
import slug from 'slug';

export interface ProductViewProps {
  product: Product & {
    distributions: (Distribution & ProductInDistribution)[];
  };
}

export const ProductView: FC<ProductViewProps> = ({
  product: { id, name, description, photo, tag, producer, distributions },
}) => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useHeader();
  const dateFormat = useDateFormat();

  const { past, current, future } = useMemo(() => {
    const now = new Date();
    const past = distributions.filter(
      ({ startAt, closeAt }) =>
        now > new Date(startAt) && now > new Date(closeAt)
    );
    const current = distributions.find(
      ({ startAt, closeAt }) =>
        now > new Date(startAt) && now < new Date(closeAt)
    );
    const future = distributions.filter(
      ({ startAt, closeAt }) =>
        now < new Date(startAt) && now < new Date(closeAt)
    );
    return { past, current, future };
  }, [distributions]);

  const product: Product = useMemo(() => {
    return {
      ...(current || {
        unit: ProductUnit.None,
        unitLabel: '',
        perUnit: 0,
        price: 0,
        isBuyable: false,
      }),
      id,
      name,
      description,
      photo,
      tag,
      producer,
    };
  }, [current, description, id, name, photo, producer, tag]);

  useEffect(() => {
    setBreadcrumbs(
      [
        { url: '/product', label: t('product.title') },
        producer && {
          url: `/producer/${producer.id}-${slug(producer.name)}`,
          label: producer.name,
        },
        {
          url: `/product/${id}-${slug(name)}`,
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
          {current && <AddToBasket {...product} />}
        </Box>
      </Box>
      {!current && future.length > 0 && (
        <Box>
          <Text as="h2">
            {t('product.distributed.future', {
              startAt: dateFormat(new Date(future[0].startAt), {
                dateStyle: 'long',
              }),
            })}
          </Text>
        </Box>
      )}
      {past.length > 0 && (
        <Box>
          <Text as="h2">
            {t('product.distributed.past', {
              closeAt: dateFormat(new Date(future[0].closeAt), {
                dateStyle: 'long',
              }),
            })}
          </Text>
        </Box>
      )}
    </Main>
  );
};

export default ProductView;
