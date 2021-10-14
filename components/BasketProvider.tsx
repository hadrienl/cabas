import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import supabase from 'lib/supabase';
import { Basket, BasketStatus, ProductUnit } from 'types/Entities';
import { useUser } from './UserProvider';
import {
  addInBasketAnonymously,
  clearBasketAnonymously,
  getBasketAnonymously,
  removeInBasketAnonymously,
} from 'lib/anonymousBasket';

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

interface BasketProviderProps {}

export const BasketProvider: FC<BasketProviderProps> = ({ children }) => {
  const [basket, setBasket] = useState<BasketContext['basket']>(null);
  const { user } = useUser();

  const fetchCurrentBasket = useCallback(async () => {
    if (!user) {
      setBasket(await getBasketAnonymously());
      return;
    }
    const { data: productsInBasket } = await supabase
      .from<{
        id: number;
        status: BasketStatus;
        quantity: number;
        total: number;
        id_in_distribution: number;
        unit: ProductUnit;
        unit_label: string;
        per_unit: number;
        unit_price: number;
        price: number;
        product_id: number;
        product_name: string;
        product_description: string;
        product_photo: string;
      }>('current_basket')
      .select('*');

    if (!productsInBasket) return;
    const basket = {
      id: productsInBasket[0].id,
      status: productsInBasket[0].status,
      total: productsInBasket[0].total,
      products: productsInBasket.map(
        ({
          id_in_distribution,
          quantity,
          unit,
          unit_label,
          per_unit,
          price,
          unit_price,
          product_id,
          product_name,
          product_description,
          product_photo,
        }) => ({
          id: id_in_distribution,
          name: product_name,
          description: product_description,
          photo: product_photo,
          quantity,
          unit,
          perUnit: per_unit,
          price,
          unitLabel: unit_label,
          unitPrice: unit_price,
        })
      ),
    };

    setBasket(basket);
  }, [user]);
  useEffect(() => {
    fetchCurrentBasket();
  }, [fetchCurrentBasket]);

  const addProduct: BasketContext['addProduct'] = useCallback(
    async (id, count) => {
      if (user) {
        await supabase.rpc('add_product_to_basket', {
          product_id: id,
          quantity: count,
        });
      } else {
        await addInBasketAnonymously(id, count);
      }

      fetchCurrentBasket();
    },
    [fetchCurrentBasket, user]
  );
  const removeProduct: BasketContext['removeProduct'] = useCallback(
    (id, count) => {
      if (!user) return removeInBasketAnonymously(id, count);
    },
    [user]
  );
  const clear: BasketContext['clear'] = useCallback(() => {
    if (!user) return clearBasketAnonymously();
  }, [user]);
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
