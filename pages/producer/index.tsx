import supabase from 'lib/supabase';
import { GetStaticProps } from 'next';
import { Producer } from 'types/Entities';
import { ProducersViewProps } from 'views/Producer/Producers';

export { default } from 'views/Producer/Producers';

export const getStaticProps: GetStaticProps<ProducersViewProps> = async () => {
  const { data: producers } = await supabase
    .from<Producer>('producer')
    .select('id, name, description, photo');

  return {
    props: {
      producers: producers || [],
    },
  };
};
