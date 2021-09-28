import { FC, useMemo } from 'react';

import Main from 'components/Main';
import Text from 'components/Text';
import { Distribution, Producer } from 'types/Entities';
import { useTranslation } from 'lib/i18n';
import Box from 'components/Box';
import Cards from 'components/Cards/Cards';
import ProducerCard from 'components/Cards/Producer';
import Link from 'components/Link';
import useDateFormat from 'lib/useDateFormat';

export interface HomeViewProps {
  distributions: (Distribution & {
    producers: Producer[];
  })[];
}
export const HomeView: FC<HomeViewProps> = ({ distributions }) => {
  const { t } = useTranslation();
  const dateFormat = useDateFormat();

  const current = useMemo(() => {
    const now = new Date();
    return distributions.filter(
      ({ startAt, closeAt }) =>
        now > new Date(startAt) && now < new Date(closeAt)
    );
  }, [distributions]);
  const next = useMemo(() => {
    const now = new Date();
    return distributions.filter(({ startAt }) => now < new Date(startAt));
  }, [distributions]);
  const past = useMemo(() => {
    const now = new Date();
    return distributions.filter(({ closeAt }) => now > new Date(closeAt));
  }, [distributions]);

  return (
    <Main>
      <Text as="h1" marginY={2}>
        {t('home.welcome')}
      </Text>
      <Box>
        {current.length > 0 && (
          <Box>
            <Text as="h2" marginY={2}>
              {t('distributions.current')}
            </Text>
            <Cards>
              {current[0].producers.map((producer) => (
                <ProducerCard key={producer.id} {...producer} />
              ))}
            </Cards>
          </Box>
        )}
        {next.length > 0 && (
          <Box>
            <Text as="h2" marginY={2}>
              {t('distributions.future', { count: next.length })}
            </Text>
            <Box as="ul">
              {next.map(({ id, startAt, closeAt, shipAt }) => (
                <Box key={id} as="li">
                  <Text as="p">
                    {t('distributions.startAt', {
                      date: dateFormat(startAt, { dateStyle: 'long' }),
                    })}
                    {` - `}
                    {t('distributions.closeAt', {
                      date: dateFormat(closeAt, { dateStyle: 'long' }),
                    })}
                    {` - `}
                    {t('distributions.shipAt', {
                      date: dateFormat(shipAt, { dateStyle: 'long' }),
                    })}
                  </Text>
                  <Link href={`/distribution/${id}`}>
                    {t('distributions.seeDetails')}
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {past.length > 0 && (
          <Box>
            <Text as="h2" marginY={2}>
              {t('distributions.past', { count: past.length })}
            </Text>
          </Box>
        )}
      </Box>
    </Main>
  );
};

export default HomeView;
