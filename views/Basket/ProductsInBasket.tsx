import * as React from 'react';

import Box from 'components/Box';
import Text from 'components/Text';
import { Basket, ProductUnit } from 'types/Entities';
import { InputNumber } from 'primereact/inputnumber';
import { getSuffix } from 'lib/strings';
import TrashButton from 'components/TrashButton';
import { useBasket } from 'components/BasketProvider';
import supabase from 'lib/supabase';

interface ProductsInBasketProps {
  products: Basket['products'];
}
export const ProductsInBasket: React.FC<ProductsInBasketProps> = ({
  products,
}) => {
  console.log(supabase);
  const { removeProduct, updateProduct } = useBasket();
  const updateQuantity = React.useCallback(
    (id: number) =>
      ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        updateProduct(id, +value);
      },
    [updateProduct]
  );

  const deleteProduct = React.useCallback(
    (id: number) => () => {
      removeProduct(id);
    },
    [removeProduct]
  );

  if (!products) return <Text>Votre panier est vide</Text>;

  return (
    <table>
      <thead>
        <tr>
          <th>Produit</th>
          <th>Prix</th>
          <th>Quantité</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {(products || []).map(({ name, id, photo, price, unit, quantity }) => (
          <tr key={id}>
            <td>{name}</td>
            <td>{price}</td>
            <td>
              <Box flexDirection="row" justifyContent="flex-end">
                <InputNumber
                  value={quantity}
                  onBlur={updateQuantity(id)}
                  mode="decimal"
                  showButtons
                  buttonLayout="horizontal"
                  size={5}
                  min={0}
                  suffix={getSuffix(unit)}
                  maxFractionDigits={2}
                  inputMode="decimal"
                  step={unit === ProductUnit.Piece ? 1 : 0.1}
                />
                <TrashButton onClick={deleteProduct(id)} />
              </Box>
            </td>
            <Box as="td">{quantity * price}</Box>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td></td>
          <td>Total</td>
          <td>
            {(products || []).reduce(
              (prev, { price, quantity }) => prev + price * quantity,
              0
            )}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default ProductsInBasket;
