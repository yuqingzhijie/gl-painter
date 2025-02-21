export function throttle<T extends (...args: any) => any>(
  fn: T,
  timeout: number,
) {
  let block = false
  let timer = NaN as unknown

  const afterExecuted = (): void => {
    block = true
    setTimeout(() => (block = false), timeout)
  }

  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timer as number)
    if (block === false) {
      fn.apply(this, args)
      afterExecuted()
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args)
        afterExecuted()
      }, timeout)
    }
  }
}

export function debounce<T extends (...args: any) => any>(
  fn: T,
  timeout: number,
  withFirst = false,
) {
  let timer = NaN as unknown

  return function (this: unknown, ...args: unknown[]) {
    if (timer) {
      clearTimeout(timer as number)
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, timeout)
    } else {
      withFirst && fn.apply(this, args)
      timer = setTimeout(() => {
        !withFirst && fn.apply(this, args)
        timer = null
      }, timeout)
    }
  }
}
