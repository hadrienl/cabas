import { FC, useEffect } from 'react';

import Box from 'components/Box';
import { useHeader } from 'components/Header/HeaderProvider';
import Main from 'components/Main';
import Text from 'components/Text';
import { useTranslation } from 'lib/i18n';
import { Producer } from 'types/Entities';
import Link from 'components/Link';

export interface ProducersViewProps {
  producers: Producer[];
}
export const ProducersView: FC<ProducersViewProps> = ({ producers }) => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useHeader();
  useEffect(() => {
    setBreadcrumbs([{ url: '/producer', label: t('producer.title') }]);

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, t]);

  return (
    <Main>
      <Text as="h1">{t('producer.title')}</Text>
      <Box my={4} as="ul">
        {producers.map(({ id, name }) => (
          <Box key={id} as="li">
            <Link href={`/producer/${id}-${name}`}>{name}</Link>
          </Box>
        ))}
      </Box>
    </Main>
  );
};

export default ProducersView;
