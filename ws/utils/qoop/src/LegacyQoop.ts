import 'reflect-metadata';
import { type Constructor, gensym } from 'looper-utils';

const PROPS = ` * qoop PROPS ${gensym()} * `;
export function Qoop<TBase extends Constructor, PropsT = any>(Base: TBase) {
  console.error(new Error(`'Qoop' is deprecated. use '@AutoInit'`));
  return class extends Base {
    public [PROPS]: PropsT;
    static paramsDefault: Record<string, any> = {};

    constructor(...args: any[]) {
      const [a0] = args;
      const {$base, ... params} = a0 ?? {};
      super(... Array.isArray($base) ? $base : []);
      this[PROPS] = { ...(params ?? {}) } as PropsT;
    }
  };
}
Qoop.PROPS = PROPS;

export function QoopObject<T=any>(){
  console.error(new Error(`'QoopObject' is deprecated. use '@AutoInit'`));
  return Qoop<typeof Object, T>(Object); }

export function Prop(opts: {writeable: boolean} =  {writeable:false}) {
  console.error(new Error(`''@Prop' is deprecated. use '@Init''`));
  return function (target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        const props = this[Qoop.PROPS];
        return props ? props[propertyKey] : undefined;
      },
      set: opts.writeable ? function (this: any, value: any) {
        const props = this[Qoop.PROPS];
        if (props) {
          props[propertyKey] = value;
        }
      } : undefined,
      enumerable: true,
      configurable: true,
    });
  };
}

export function Setter(propName: string) {
  console.error(new Error(`'@Setter' is deprecated.`));
  return function (_target: any, methodName: string, descriptor: PropertyDescriptor) {
    // const originalMethod = descriptor.value;

    descriptor.value = function (this:any, ...args: any[]) {

      const valueToSet = args[0];
      const props = this[Qoop.PROPS];

      if (props) {
        props[propName] = valueToSet;
      } else {
        console.warn(`[${methodName}] Property store (Qoop.PROPS) not found on instance.`);
      }

    };

    return descriptor;
  };
}
