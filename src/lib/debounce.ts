export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
): T & { cancel: () => void } {
  let id: ReturnType<typeof setTimeout> | undefined;

  const debounced = ((...args: Parameters<T>) => {
    if (id !== undefined) clearTimeout(id);
    id = setTimeout(() => {
      id = undefined;
      fn(...args);
    }, ms);
  }) as T & { cancel: () => void };

  debounced.cancel = () => {
    if (id !== undefined) clearTimeout(id);
    id = undefined;
  };

  return debounced;
}
