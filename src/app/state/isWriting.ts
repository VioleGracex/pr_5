// state/isWriting.ts
let isWriting: boolean | false = false;

const setIsWriting = (value: boolean): void => {
  isWriting = value;
};

const getIsWriting = (): boolean => {
  return isWriting;
};

export { setIsWriting, getIsWriting };
