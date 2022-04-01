export const updateObject = <T, U>(oldObject: T, updatedProperties: U) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const isBlank = (itemsToTest: string[]) => {
  let valid = true;
  itemsToTest.forEach((item: string) => {
    if (!item || /^\s*$/.test(item)) {
      valid = false;
      return;
    }
  });
  return valid;
};
