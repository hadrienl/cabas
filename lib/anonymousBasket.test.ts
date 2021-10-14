import {
  addInBasketAnonymously,
  clearBasketAnonymously,
  getBasketAnonymously,
  removeInBasketAnonymously,
} from './anonymousBasket';
import supabase from './supabase';

jest.mock('./supabase', () => {
  const mockedData = {
    data: undefined,
  };
  const mockedLib = {
    setMockedData: (data: any) => {
      mockedData.data = data;
    },
    from: <T>(table: string) => {
      if (table !== 'product_in_distribution') {
        throw new Error('wrong table');
      }
      return {
        select: (request: string) => {
          return {
            in: () => {
              return mockedData as unknown as T[];
            },
          };
        },
      };
    },
  };

  return mockedLib;
});
beforeEach(() => {
  window.localStorage.clear();
});
it('should get empty basket', async () => {
  const basket = await getBasketAnonymously();
  expect(basket).toEqual({
    products: [],
    total: 0,
    status: 0,
  });
  expect(window.localStorage.getItem('__basket')).toBeNull();
});

it('should get empty basket with corrupted data', async () => {
  localStorage.setItem('__basket', 'foo');
  const basket = await getBasketAnonymously();
  expect(basket).toEqual({
    products: [],
    total: 0,
    status: 0,
  });

  localStorage.setItem('__basket', '{}');
  const basket2 = await getBasketAnonymously();
  expect(basket2).toEqual({
    products: [],
    total: 0,
    status: 0,
  });
});

it('should get saved products from database', async () => {
  window.localStorage.setItem(
    '__basket',
    JSON.stringify([
      {
        id: 1,
        count: 3,
      },
      {
        id: 2,
        count: 5,
      },
    ])
  );

  (supabase as any).setMockedData([
    {
      id: 1,
      price: 2.5,
      perUnit: 1,
      unit: 1,
      unitLabel: '',
      product: {
        name: 'foo',
        description: 'some foo',
        photo: '',
      },
    },
    {
      id: 2,
      price: 3,
      perUnit: 1,
      unit: 1,
      unitLabel: '',
      product: {
        name: 'bar',
        description: 'some bar',
        photo: '',
      },
    },
  ]);
  const basket = await getBasketAnonymously();
  expect(basket).toEqual({
    products: [
      {
        id: 1,
        price: 2.5,
        perUnit: 1,
        unit: 1,
        unitLabel: '',
        name: 'foo',
        description: 'some foo',
        photo: '',
        quantity: 3,
      },
      {
        id: 2,
        price: 3,
        perUnit: 1,
        unit: 1,
        unitLabel: '',
        name: 'bar',
        description: 'some bar',
        photo: '',
        quantity: 5,
      },
    ],
    total: 22.5,
    status: 0,
  });
});

it('should add products', async () => {
  expect(window.localStorage.getItem('__basket')).toBeNull();
  await addInBasketAnonymously(1, 3);
  expect(window.localStorage.getItem('__basket')).toBe(
    JSON.stringify([
      {
        id: 1,
        count: 3,
      },
    ])
  );

  await addInBasketAnonymously(2, 1);
  expect(window.localStorage.getItem('__basket')).toBe(
    JSON.stringify([
      {
        id: 1,
        count: 3,
      },
      {
        id: 2,
        count: 1,
      },
    ])
  );

  await addInBasketAnonymously(1, 2);
  expect(window.localStorage.getItem('__basket')).toBe(
    JSON.stringify([
      {
        id: 1,
        count: 5,
      },
      {
        id: 2,
        count: 1,
      },
    ])
  );
});

it('should remove products', async () => {
  window.localStorage.setItem(
    '__basket',
    JSON.stringify([
      {
        id: 1,
        count: 5,
      },
      {
        id: 2,
        count: 1,
      },
    ])
  );
  await removeInBasketAnonymously(2, 1);
  expect(window.localStorage.getItem('__basket')).toBe(
    JSON.stringify([
      {
        id: 1,
        count: 5,
      },
    ])
  );
  await removeInBasketAnonymously(1, 1);
  expect(window.localStorage.getItem('__basket')).toBe(
    JSON.stringify([
      {
        id: 1,
        count: 4,
      },
    ])
  );
  await removeInBasketAnonymously(1, 2);
  expect(window.localStorage.getItem('__basket')).toBe(
    JSON.stringify([
      {
        id: 1,
        count: 2,
      },
    ])
  );
  await removeInBasketAnonymously(42, 2);
  expect(window.localStorage.getItem('__basket')).toBe(
    JSON.stringify([
      {
        id: 1,
        count: 2,
      },
    ])
  );
  await removeInBasketAnonymously(1, 422);
  expect(window.localStorage.getItem('__basket')).toBe(JSON.stringify([]));
});

it('should reset basket', () => {
  clearBasketAnonymously();
  expect(localStorage.getItem('__basket')).toBe(null);
});
