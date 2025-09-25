export function getPropertyDescriptor(object: any, property: string | symbol):PropertyDecorator|undefined{
  if( object === null || object === undefined ) return undefined;
  const result = Object.getOwnPropertyDescriptor(object, property);
  if(result) return result as PropertyDecorator;
  const proto = Object.getPrototypeOf(object);
  return getPropertyDescriptor(proto, property);
}
