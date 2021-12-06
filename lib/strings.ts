import { ProductUnit } from 'types/Entities';

export const getSuffix = (unit: ProductUnit) => {
  switch (unit) {
    case ProductUnit.Kg:
      return ' kg';
    case ProductUnit.Liter:
      return ' l';
    default:
      return '';
  }
};
