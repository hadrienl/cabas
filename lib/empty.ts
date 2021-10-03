const EmptyObject: any = {};
Object.freeze(EmptyObject);

export const getEmptyObject = <T>() => {
  return EmptyObject as T;
};

const EmptyArray: any[] = [];
Object.freeze(EmptyArray);

export const getEmptyArray = <T>() => {
  return EmptyArray as T[];
};
