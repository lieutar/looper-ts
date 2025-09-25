import { gensym, type Constructor } from "looper-utils";
import { getImpl } from "./qoop/utils";
import { Init, type InitArgType } from "./AutoInit";

const KEY_TRAIT = ` * trait-key * `;
const KEY_TPROP = ' * trait-prop-key * ';

export interface ITrait{
  constructor: TraitClass;
  owner?: any;
  _init?(params:any):void;
}
export interface TraitClass {
  new (params:{owner:any}): ITrait;
  [KEY_TRAIT]: string;
}

export function isTraitClass(o:any): o is TraitClass{
  return ('function' === typeof o) &&  ('string' === typeof o[KEY_TRAIT]); }

export interface TraitOptions { hide?(name:string):boolean }

export const defaultTraitHide = (name:string) => { return name.match(/^[^a-zA-Z]/) || name.match(/^$/); };

export function Trait(params:TraitOptions={}){
  const hide = params.hide ? params.hide : defaultTraitHide;
  return <T extends Constructor>(Base: T) => {
    const key = ' * trait ' + getImpl(Base.prototype).constructor.name + '(' + gensym() + ') * ';
    class TraitClass extends Base{
      static [KEY_TRAIT] = key;
    }
    const impl = getImpl( Base.prototype );
    const src = Object.getOwnPropertyDescriptors( impl );
    const target = TraitClass.prototype as {[KEY_TPROP]?: {[key:string]: any}};
    target[KEY_TPROP] = {};
    for(const [propertyKey, descriptor] of Object.entries(src)){

      if(propertyKey === 'constructor' || hide(propertyKey)) continue;

      target[KEY_TPROP][propertyKey] = (()=>{
        // the property is not a method
        if( !descriptor || descriptor.get || descriptor.value === null ){
          return (proto:any)=>Object.defineProperty(proto, propertyKey,
            { get(){
              const traitInstance = this[key];
              if(!traitInstance) throw new Error(`${this}['${key}'](${impl.constructor.name}) isn't defined.`);
              return traitInstance[propertyKey]; }});
        }

        if(descriptor.value){
          if('function' !== typeof descriptor.value) throw new Error();
          // the property is a method
          return (proto:any)=>Object.defineProperty(proto, propertyKey, {
            value: function(... args:any[]){
              return this[key][propertyKey](... args);
            }
          });
        }
      })();
    }
    return TraitClass;
  };
}

export function TraitProp(){
  return (target:any, propertyKey: string | symbol, descriptor?: PropertyDescriptor)=>{
    if(descriptor) return;
    Object.defineProperty(target, propertyKey, {value: null, writable: true, enumerable: true, configurable: true});
  };
}

export function InitTProp(arg?:InitArgType){
  const init = Init(arg);
  const tprop = TraitProp();
  return (... args:[any, string|symbol, PropertyDescriptor?])=>{
    init(... args);
    tprop(... args);
  };
}

export type TraitMixerType <
        TBase extends Constructor = Constructor,
        TInterface                = {}
  > = (Base:TBase) => Constructor<InstanceType<TBase> & TInterface>;

export function makeMixer<TInterface>(arg: Constructor){
  if(!isTraitClass(arg)){
    throw new Error(`'${arg.name}' isn't a Trait.`);
  }
  const traitClass = arg as TraitClass;
  const props:{[key:string]:(arg:any)=>void} = traitClass.prototype[KEY_TPROP] || {};
  return function(Base:Constructor){
    class Mixed extends Base{
      constructor(... args:any[]){
        super(... args);
        const params = args[0] ?? {};
        const traitInstance = new traitClass({ ... params, owner: this});
        (this as any)[traitClass[KEY_TRAIT]!] = traitInstance;
        if('function' === typeof traitInstance._init) traitInstance._init(params);
      }
    }
    const proto = Mixed.prototype as any;
    for(const inject of Object.values(props)) inject(proto);
    return Mixed as Constructor<TInterface>;
  } as TraitMixerType<Constructor, TInterface>;
}

export type ExtractTraitInterface<T> = T extends TraitMixerType<any, infer TInterface>
  ? TInterface
  : never;

export type TraitMixersToInterfaces<T extends TraitMixerType<any>[]> = {
  [K in keyof T]: ExtractTraitInterface<T[K]>;
};

export type CompositeInterfaces<T extends any[]> = T extends [infer VFirst, ...infer VRest]
  ? VFirst & CompositeInterfaces<VRest>
  : unknown;

export type CompositeTraits<TMixers extends TraitMixerType<any>[]> =
        CompositeInterfaces<TraitMixersToInterfaces<TMixers>>;


export function WithTraits<
  TBase extends Constructor,
  TMixers extends TraitMixerType<any>[]
>(
  Base: TBase,
  ...traitMixers: TMixers
): Constructor<InstanceType<TBase> & CompositeTraits<TMixers>> {
   const Mixed = traitMixers.reduce((CurrentBase: Constructor, traitMixer: TraitMixerType) => {
    return traitMixer(CurrentBase);
  }, Base) as Constructor<InstanceType<TBase> & CompositeTraits<TMixers>>;
  return Mixed;
}
