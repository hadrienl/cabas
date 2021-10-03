import Cards from 'components/Cards/Cards';
import ProducerCard from 'components/Cards/Producer';
import Link from 'components/Link';
import Main from 'components/Main';
import Text from 'components/Text';
import { getDistributionTimeRange } from 'lib/dates';
import { useTranslation } from 'lib/i18n';
import useDateFormat from 'lib/useDateFormat';
import { FC } from 'react';
import { Distribution, Producer } from 'types/Entities';

export interface DistributionViewProps {
  distribution: Distribution;
  producers: Producer[];
}
export const DistributionView: FC<DistributionViewProps> = ({
  distribution,
  producers,
}) => {
  const { t } = useTranslation();
  const dateFormat = useDateFormat();
  const state = getDistributionTimeRange(
    distribution.startAt,
    distribution.closeAt
  );

  return (
    <Main>
      <Text as="h1">{t(`distributions.${state}`)}</Text>
      {state === 'future' && (
        <Text>
          {t('distributions.startAt', {
            date: dateFormat(distribution.startAt, { dateStyle: 'long' }),
          })}
        </Text>
      )}
      {state !== 'past' && (
        <>
          <Text>
            {t('distributions.closeAt', {
              date: dateFormat(distribution.closeAt, { dateStyle: 'long' }),
            })}
          </Text>
          <Text>
            {t('distributions.shipAt', {
              date: dateFormat(distribution.shipAt, { dateStyle: 'long' }),
            })}
          </Text>
        </>
      )}
      {state === 'future' && <Text>Je veux être averti par email !</Text>}
      <Text as="h2">{t('distributions.producers')}</Text>
      <Cards>
        {producers.map((producer) => (
          <ProducerCard key={producer.id} {...producer} />
        ))}
      </Cards>
    </Main>
  );
};

export default DistributionView;
