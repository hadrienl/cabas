import { createContext, useContext } from 'react';
import { Distribution } from 'types/Entities';

interface DistributionsContext {
  distributions: Distribution[];
  loading: boolean;
  save: (d: Distribution) => Promise<Distribution>;
}
export const context = createContext<DistributionsContext>({
  distributions: [],
  loading: false,
  async save() {
    return {} as Distribution;
  },
});
export const useDistributions = () => useContext(context);
