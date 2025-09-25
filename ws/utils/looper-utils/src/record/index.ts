import type { ValuesOf } from "looper-utils";

export function mapRecord<T extends {}, TKey = keyof T, TValue = ValuesOf<T>>(
  src: T,
  cb?: { key?: (src: keyof T) => TKey, value?: (src: ValuesOf<T>) => TValue }
) {
  const options = cb ?? {};
  const keyCb   = ( options.key   ?? ((a) => a) ) as (src: keyof T) => TKey;
  const valueCb = ( options.value ?? ((a) => a) ) as (src: ValuesOf<T>) => TValue;

  return Object.fromEntries(
    (Object.entries(src) as [keyof T, ValuesOf<T>][]).map(([key, value]) => [
      keyCb(key),
      valueCb(value)
    ])
  );
}
