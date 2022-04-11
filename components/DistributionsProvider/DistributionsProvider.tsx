import supabase from 'lib/supabase';
import { FC, useCallback, useEffect, useState } from 'react';
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

  const save = useCallback(async (distribution: Distribution) => {
    const { data, error } = await supabase.from('distribution').upsert({
      id: distribution.id,
      start_at: distribution.startAt,
      close_at: distribution.closeAt,
      ship_at: distribution.shipAt,
    });
    if (error) {
      throw error;
    }
    if (!data) {
      return null;
    }
    const newDistribution: Distribution = {
      id: data[0].id,
      startAt: data[0].start_at,
      closeAt: data[0].close_at,
      shipAt: data[0].ship_at,
    };

    setDistributions((distributions) => {
      const newDistributions = [...distributions, newDistribution];
      newDistributions.sort(
        (a, b) => +new Date(b.startAt) - +new Date(a.startAt)
      );
      return newDistributions;
    });
    return data[0];
  }, []);

  return (
    <context.Provider value={{ distributions, loading, save }}>
      {children}
    </context.Provider>
  );
};

export default DistributionsProvider;
