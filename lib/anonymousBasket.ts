import { Basket, ProductBase, ProductInDistribution } from 'types/Entities';
import supabase from './supabase';

interface SavedProduct {
  id: number;
  count: number;
}
const LS_BASKET_KEY = '__basket';
const getProducts = (): SavedProduct[] => {
  try {
    const products = JSON.parse(localStorage.getItem(LS_BASKET_KEY) || '');
    return Array.isArray(products) ? products : [];
  } catch (e) {
    return [];
  }
};
const setProducts = (products: SavedProduct[]) => {
  localStorage.setItem(LS_BASKET_KEY, JSON.stringify(products));
};
export const getBasketAnonymously = async (): Promise<Basket> => {
  const savedProducts = getProducts();
  const { data: productsData } = await supabase
    .from<
      ProductInDistribution & {
        id: number;
        product: ProductBase;
      }
    >('product_in_distribution')
    .select(
      `id,
      price,
      perUnit: per_unit,
      unit,
      unitLabel: unit_label,
      product(name, description, photo)
    `
    )
    .in(
      'id',
      savedProducts.map(({ id }) => id)
    );

  const products = (productsData || []).map(
    ({ product: { name, description, photo }, id, ...rest }) => ({
      ...rest,
      name,
      description,
      photo,
      id,
      quantity: (
        savedProducts.find(({ id: sid }) => sid === id) || { count: 0 }
      ).count,
    })
  );

  return {
    products,
    status: 'pending',
    total: products.reduce(
      (prev, { price, quantity }) => prev + price * quantity,
      0
    ),
  };
};
export const addInBasketAnonymously = async (id: number, count: number) => {
  const products = getProducts();
  const found = products.find(({ id: pid }) => pid === id);
  if (found) {
    found.count += count;
    setProducts([...products]);
    return;
  }
  products.push({
    id,
    count,
  });
  setProducts(products);
};
export const removeInBasketAnonymously = async (id: number) => {
  const products = getProducts();
  const found = products.find(({ id: pid }) => pid === id);
  if (!found) return;

  setProducts(products.filter(({ id }) => id !== found.id));
};

export const updateInBasketAnonymously = async (
  id: number,
  quantity: number
) => {
  const newProducts = getProducts().map((product) =>
    id === product.id ? { ...product, count: quantity } : product
  );
  setProducts(newProducts);
};
export const clearBasketAnonymously = () => {
  localStorage.removeItem(LS_BASKET_KEY);
};
