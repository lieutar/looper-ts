export function unit (src: string | number, unit:string):string{
  return 'number' === typeof src ? `${src}${unit}` : src; }

export function divideNumUnit(src:string):[number, string]{
  const match = src.replace(/^\s+|\s+$/, '').match(/^(\d+)\s*(\D+)$/);
  return match ? [Number(match[1]??0), match[2]??'px'] : [0, 'px'];
}
