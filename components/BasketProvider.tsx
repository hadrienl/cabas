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
  updateInBasketAnonymously,
} from 'lib/anonymousBasket';

interface BasketContext {
  basket: Basket | null;
  addProduct: (productId: number, quantity: number) => void;
  removeProduct: (productId: number) => void;
  updateProduct: (productId: number, quantity: number) => void;
  clear: () => void;
  refresh: () => void;
  submit: () => Promise<any>;
}
export const context = createContext<BasketContext>({
  basket: null,
  addProduct() {},
  removeProduct() {},
  updateProduct() {},
  clear() {},
  refresh() {},
  async submit() {},
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

    const { products: savedProducts = [] } = await getBasketAnonymously();
    clearBasketAnonymously();

    if (!productsInBasket || productsInBasket.length === 0) {
      /**
       * If local basket exists, save it
       */
      if (savedProducts.length === 0) {
        setBasket({
          status: 0,
          total: 0,
          products: [],
        });
        return;
      }

      for (const { id, quantity } of savedProducts) {
        await supabase.rpc('add_product_to_basket', {
          product_id: id,
          quantity,
        });
      }
      fetchCurrentBasket();
      return;
    }
    const products = productsInBasket
      .map(
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
      )
      .reduce<NonNullable<Basket['products']>>((prev, product) => {
        const found = prev.find(({ id }) => product.id === id);
        if (found) {
          found.quantity += product.quantity;
          return prev;
        }
        return [...prev, product];
      }, []);

    const basket = {
      id: productsInBasket[0] && productsInBasket[0].id,
      status: productsInBasket[0] && productsInBasket[0].status,
      total: products.reduce(
        (prev, { price, quantity }) => prev + price * quantity,
        0
      ),
      products,
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
    async (id) => {
      if (user) {
        await supabase.rpc('remove_products_from_basket', {
          product_id: id,
        });
      } else {
        removeInBasketAnonymously(id);
      }
      fetchCurrentBasket();
    },
    [fetchCurrentBasket, user]
  );
  const updateProduct: BasketContext['updateProduct'] = useCallback(
    async (id, quantity) => {
      if (user) {
        await supabase.rpc('update_product_from_basket', {
          product_id: id,
          new_quantity: quantity,
        });
      } else {
        updateInBasketAnonymously(id, quantity);
      }
      fetchCurrentBasket();
    },
    [fetchCurrentBasket, user]
  );
  const clear: BasketContext['clear'] = useCallback(() => {
    if (!user) return clearBasketAnonymously();
  }, [user]);
  const refresh: BasketContext['refresh'] = useCallback(() => {}, []);

  const submit: BasketContext['submit'] = useCallback(async () => {
    if (!user) return;
    const orderId = await supabase.rpc('submit_current_basket');
    console.log('submit', orderId);
  }, [user]);

  return (
    <context.Provider
      value={{
        basket,
        addProduct,
        removeProduct,
        updateProduct,
        clear,
        refresh,
        submit,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default BasketProvider;
