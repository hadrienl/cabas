import { GetStaticProps } from 'next';
import { getProducers } from 'resources/producers';
import { ProducersViewProps } from 'views/Producer/Producers';

export { default } from 'views/Producer/Producers';

export const getStaticProps: GetStaticProps<ProducersViewProps> = async () => {
  const { producers } = await getProducers();
  console.log(producers);
  return {
    props: {
      producers,
    },
  };
};
