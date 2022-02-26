import { createContext, useContext } from 'react';
import { Distribution } from 'types/Entities';

interface DistributionsContext {
  distributions: Distribution[];
  loading: boolean;
}
export const context = createContext<DistributionsContext>({
  distributions: [],
  loading: false,
});
export const useDistributions = () => useContext(context);
