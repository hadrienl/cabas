import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

import { Product, ProductUnit } from 'resources/types';
import Box from './Box';
import Text from './Text';
import { useTranslation } from 'lib/i18n';

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
interface AddToBasketProps {
  product: Product;
}
export const AddToBasket: FC<AddToBasketProps> = ({
  product: { id, unit, price },
}) => {
  const {
    t,
    i18next: { language },
  } = useTranslation();
  const [count, setCount] = useState(1);
  const add = useCallback(() => {
    console.log(`add ${count} products #${id}`);
  }, [count, id]);
  const total = count * price;
  const suffix = getSuffix(unit);

  return (
    <Box flex="1" justifyContent="end">
      <Box flexDirection="row" justifyContent="space-between" mb={2}>
        <Box>
          <Text fontSize={4}>
            {t('distributions.product.price', {
              price: new Intl.NumberFormat(language, {
                style: 'currency',
                currency: 'EUR',
              }).format(price),
              context: `${unit}`,
            })}
          </Text>
          <Text ml={2}>
            {t('product.addToBasket.totalPrice', {
              price: new Intl.NumberFormat(language, {
                currency: 'EUR',
                style: 'currency',
              }).format(total),
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
