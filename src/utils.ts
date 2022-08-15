const idGenerator = function*() {
  let i = 0;
  while(true) {
    yield i++;
  }
};

export const IDGenerator = idGenerator();

export const noop = () => undefined;

export const alwaysTrue = () => true;

export const alwaysFalse = () => false;