const idGenerator = function*() {
  let i = 0;
  while(true) {
    yield i++;
  }
};

export const IDGenerator = idGenerator();