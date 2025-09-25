import type { Constructor } from 'looper-utils';
import 'reflect-metadata';
import { getImpl } from './qoop/constants';

const INIT_PROP_KEY  = Symbol('AutoInit');
const AFTER_INIT_KEY = Symbol('AfterInit');

export interface AutoInitOptions{
afterInit?: string | ((params:any)=>void);
prepare?: (params:any) => any;
}

type Initializer = (params:any)=>void;
export function AutoInit(params: AutoInitOptions = {}) {

  const argAfterInit = (()=>{
    if(!params.afterInit) return (_:any)=>{};
    if('string' === typeof params.afterInit)
      return function(this:any, arg:any){ this[params.afterInit as string](arg); }
    return params.afterInit;
  })();

  const prepare = params.prepare ?? (a => a);

  return <T extends Constructor>(Base: T) => {

    const initializers  = Reflect.getMetadata(INIT_PROP_KEY,  Base.prototype) || {};
    const afterInitKeys = Reflect.getMetadata(AFTER_INIT_KEY, Base.prototype) || [];

    return class extends Base {
      constructor(...args: any[]) {
        super(...args);

        const params = prepare.apply( this,  [ args[0] || {} ] );

        for (const [key, init] of Object.entries(initializers)) {
          const value = (init as Initializer).apply(this, [params]);
          (this as any)[key] = value;
        }

        for(const key of afterInitKeys){
          (this[key as keyof this] as any)(params);
        }
        argAfterInit.apply(this, [params]);
      }
    }
  };
}

export function AfterInit(){
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor ) => {
    if(!descriptor.value) throw new Error();
    let keys = Reflect.getMetadata(AFTER_INIT_KEY, target) || [];
    keys.push(propertyKey);
    Reflect.defineMetadata(AFTER_INIT_KEY, keys, target);
  };
}

export type InitArgType = string
        | ((params: {}) => any)
        | {default?:any, makeDefault?:(params:any)=>any, key?:string}
        | undefined;
export function Init(arg?: InitArgType) {
  return (target: any, propertyKey: string | symbol, _?: PropertyDescriptor) => {
    const initializer = (() => {
      if (!arg) return (params: any) => params[propertyKey];
      if ('function' === typeof arg) return arg;
      if ('string'   === typeof arg) return (params: any) => params[arg];
      const key = arg.key ?? propertyKey;
      const makeDefault = (()=>{
        if(arg.makeDefault) return arg.makeDefault;
        return ()=> arg.default;
      })();
      return function(this:any, params:any){
        return params[key] ?? makeDefault.apply(this, [params]) };
    })();

    const existingKeys = Reflect.getMetadata(INIT_PROP_KEY, target) || {};
    existingKeys[propertyKey] = initializer;
    Reflect.defineMetadata(INIT_PROP_KEY, existingKeys, target);
  };
}
