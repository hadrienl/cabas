import supabase from 'lib/supabase';
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Basket, BasketStatus } from 'types/Entities';
import { useUser } from './UserProvider';

interface BasketContext {
  basket: Basket | null;
  addProduct: (productId: number, quantity: number) => void;
  removeProduct: (productId: number, quantity: number) => void;
  clear: () => void;
  refresh: () => void;
}
export const context = createContext<BasketContext>({
  basket: null,
  addProduct() {},
  removeProduct() {},
  clear() {},
  refresh() {},
});

export const useBasket = () => useContext(context);

const createBasket = async (userId: string) => {
  // create a new basket
  const { data } = await supabase
    .from('basket')
    .insert({
      fk_customer: userId,
      status: BasketStatus.Pending,
    })
    .single();
  return data as Basket;
};

interface BasketProviderProps {}

export const BasketProvider: FC<BasketProviderProps> = ({ children }) => {
  const [basket, setBasket] = useState<BasketContext['basket']>(null);
  const { user } = useUser();

  const fetchCurrentBasket = useCallback(async () => {
    const current = await supabase.from('basket').select(`*`);
    console.log(current);
  }, []);
  useEffect(() => {
    fetchCurrentBasket();
  }, [fetchCurrentBasket]);

  const addProduct: BasketContext['addProduct'] = useCallback(async () => {
    if (!user) return;
    const currentBasket = await (basket || createBasket(user.id));
    setBasket(currentBasket);
    console.log('wesh', currentBasket);
  }, [basket, user]);
  const removeProduct: BasketContext['removeProduct'] =
    useCallback(() => {}, []);
  const clear: BasketContext['clear'] = useCallback(() => {}, []);
  const refresh: BasketContext['refresh'] = useCallback(() => {}, []);

  return (
    <context.Provider
      value={{ basket, addProduct, removeProduct, clear, refresh }}
    >
      {children}
    </context.Provider>
  );
};

export default BasketProvider;
