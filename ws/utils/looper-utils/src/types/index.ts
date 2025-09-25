export type PPick<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;
export type PExcept<T, TOmit extends keyof T> = PPick<T, Exclude<keyof T, TOmit>>;
export type Constructor<T = {}> = new (...args: any[]) => T;
export type ValuesOf<T> = T[keyof T];
export type Nil = null | undefined;
export type Nullable<T> = T | Nil;

export function isObject(o:any): o is Object { return o instanceof Object; }
