import { FC, useCallback, useState } from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

import { ProductUnit, ProductInDistribution, Product } from 'types/Entities';
import Box from './Box';
import Text from './Text';
import { useTranslation } from 'lib/i18n';
import useNumberFormat from 'lib/useNumberFormat';
import { useBasket } from './BasketProvider';

const getSuffix = (unit: ProductUnit) => {
  switch (unit) {
    case ProductUnit.Kg:
      return ' kg';
    case ProductUnit.Liter:
      return ' l';
    default:
      return '';
  }
};
interface AddToBasketProps extends Pick<Product, 'id'>, ProductInDistribution {}
export const AddToBasket: FC<AddToBasketProps> = ({
  id,
  unit,
  price,
  unitLabel,
  perUnit,
}) => {
  const { t } = useTranslation();
  const { addProduct } = useBasket();
  const numberFormat = useNumberFormat();
  const [count, setCount] = useState(1);
  const add = useCallback(() => {
    addProduct(id, count);
  }, [addProduct, count, id]);
  const total = count * price;
  const suffix = getSuffix(unit);

  return (
    <Box flex="1" justifyContent="end">
      <Box flexDirection="row" justifyContent="space-between" mb={2}>
        <Box>
          <Box flexDirection="row" alignItems="baseline">
            <Text fontSize={4}>
              {t('product.price', {
                price: numberFormat(price, {
                  style: 'currency',
                  currency: 'EUR',
                }),
                context: `${unit}`,
              })}
            </Text>
            {unitLabel && <Text> / {unitLabel}</Text>}
          </Box>
          <Text ml={2}>
            {t('product.addToBasket.totalPrice', {
              price: numberFormat(total, {
                currency: 'EUR',
                style: 'currency',
              }),
            })}
          </Text>
        </Box>
        <InputNumber
          value={count}
          onValueChange={({ value }) => setCount(+value)}
          mode="decimal"
          showButtons
          buttonLayout="horizontal"
          size={5}
          min={0}
          suffix={suffix}
          maxFractionDigits={2}
          inputMode="decimal"
          step={unit === ProductUnit.Piece ? 1 : 0.1}
        />
      </Box>
      <Button type="button" onClick={add}>
        <Text justifyContent="center" flex="1">
          {t('product.addToBasket.label')}
        </Text>
      </Button>
    </Box>
  );
};

export default AddToBasket;
