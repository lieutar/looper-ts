export type DelegateOptions = {
  field?: string,
  get?: boolean
};

export function Delegate(propertyName: string, optArg: string | DelegateOptions = {} ) {

  const opt = 'string' === typeof optArg ? {field: optArg} : optArg;

  return function (target: any, key: string, _descriptor?: PropertyDescriptor) {
    const field = opt.field ?? key;

    const getDelegatedObject = (owner:any) => {
      const delegatedObject = owner[propertyName];
      if (delegatedObject) return delegatedObject;
      console.warn(`[${key}] Delegation failed: Property '${propertyName}' not found.`);
      return null;
    };

    if(opt.get){
      Object.defineProperty(target, key, {
        get: function (this: any) {
          const delegatedObject = getDelegatedObject(this);
          if(!delegatedObject) return undefined;
          return delegatedObject[field];
        }
      } );
    }else{
      Object.defineProperty(target, key, {
        get: function (this: any) {
          const delegatedObject = getDelegatedObject(this);
          if(!delegatedObject) return undefined;
          const originalMethod = delegatedObject[field];

          if (typeof originalMethod !== 'function') {
            console.warn(
              `[${key}] Delegation failed: Method '${field}' not found or not a function on '${propertyName}'.`);
            return undefined;
          }

          return originalMethod.bind(delegatedObject);
        },
        //*
        set: function (this: any, _value: any) {
          console.warn(`[${key}] Attempted to set delegated method. Delegated methods are typically read-only.`);
        },
        //*/
        enumerable: true,
        configurable: true,
      });
    }
  };
}
