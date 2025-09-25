import { getPropertyDescriptor } from "@src/object";
import { describe, expect, test } from "vitest";

describe('object/getPropertyDescriptor', ()=>{

  const o = {
    propWithValue: 'the value',
    someMethod(){},
    get someGetter(){return 'something'}
  };

  describe('normal', ()=>{

    const normal = (o:any)=>{
      expect((getPropertyDescriptor(o, 'propWithValue') as any)?.value).toEqual('the value');
      expect((getPropertyDescriptor(o, 'someMethod') as any)?.value).toBeTypeOf('function');
      expect((getPropertyDescriptor(o, 'someGetter') as any)?.get).toBeTypeOf('function');
    }

    test('from own', ()=>{ normal(o); });
    test('from proto', ()=>{ normal( Object.create(Object.create(Object.create(o))) ); });
  });

  describe('abnormal', ()=>{

    test('malformed property', ()=>{
      expect(getPropertyDescriptor(o, 'xxx')).toBe(undefined);
    });

  });
});
