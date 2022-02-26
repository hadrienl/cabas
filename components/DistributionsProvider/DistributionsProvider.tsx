import supabase from 'lib/supabase';
import { FC, useEffect, useState } from 'react';
import { Distribution } from 'types/Entities';
import { context } from './context';

export const DistributionsProvider: FC = ({ children }) => {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase.from('distribution').select(`
      id,
      startAt: start_at,
      closeAt: close_at,
      shipAt: ship_at
    `);
      if (!data) {
        setDistributions([]);
        setLoading(false);
        return;
      }

      setDistributions(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <context.Provider value={{ distributions, loading }}>
      {children}
    </context.Provider>
  );
};

export default DistributionsProvider;
