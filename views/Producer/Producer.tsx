import { FC, useEffect } from 'react';

import Box from 'components/Box';
import Text from 'components/Text';
import Main from 'components/Main';
import { Producer, Product } from 'resources/types';
import Cards from 'components/Cards/Cards';
import ProductCard from 'components/Cards/Product';
import { Link, useHeader } from 'components/Header/HeaderProvider';
import { useTranslation } from 'lib/i18n';
import Markdown from 'components/Markdown';

export interface ProducerViewProps {
  producer: Producer;
  products: Product[];
}

export const ProducerView: FC<ProducerViewProps> = ({
  producer: { id, name, description, photo },
  products,
}) => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useHeader();
  useEffect(() => {
    setBreadcrumbs(
      [
        { url: '/producer', label: t('producer.title') },
        {
          url: `/producer/${id}-${name}`,
          label: name,
        },
      ].filter(Boolean) as Link[]
    );

    return () => setBreadcrumbs(null);
  }, [id, name, setBreadcrumbs, t]);

  return (
    <Main>
      <Box>
        <Text as="h1">{name}</Text>
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
          </Box>
        </Box>
        <Text as="h2">{t('producer.products')}</Text>
        <Cards>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Cards>
      </Box>
    </Main>
  );
};

export default ProducerView;
