const debounce = (fn: () => void, delay: number) => {
  let timer: NodeJS.Timeout | null = null;
  return function (...args: any) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
};

export default debounce;
