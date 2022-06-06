type Procedure = (...args: any[]) => any;

interface DebouncedFunction<F extends Procedure> {
  (this: ThisParameterType<F>, ...args: Parameters<F>): void;
  cancel: () => void;
}
/**
 * 简单的防抖函数
 * @param call 需要限制执行频率的函数
 * @param delay 延迟时间，这段时间过后，才可触发第二次
 * @returns void
 */
export function debounce<F extends Procedure>(call: F, delay: number): DebouncedFunction<F> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounceFun = function (this: ThisParameterType<F>, ...args: Parameters<F>): void {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      call.apply(this, args);
    }, delay);
  };
  debounceFun.cancel = function () {
    timer !== undefined && clearTimeout(timer);
  };
  return debounceFun;
}