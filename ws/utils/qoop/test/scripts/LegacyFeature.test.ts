import type { Constructor } from "looper-utils";
import { Feature, fMixinTools, WithFeatures, type IFeatureClass } from "@src/index";
import { describe, expect, test, expectTypeOf } from "vitest";


function pushv(obj:{}, v:string){
  if(!(obj as any).pushed){
    (obj as any).pushed = v;
  }else{
    (obj as any).pushed += ' ' + v;
  }
}

interface IBar {
get attr(): string;
meth (): string;
};

class Bar extends Feature(){
  static applyFeature(Base: Constructor){
    const {self, d} = fMixinTools(Bar as IFeatureClass<IBar>);
    return class extends Base{
      get attr(){ return self(this).attr as string; }
      meth = d('meth') as ()=>string;
      constructor(... args: any[]){
        super(... args);
        pushv(this, 'Bar');
        new Bar().inject(this);
      }
    }
  }
  readonly attr = 'bar';
  meth(){ return 'meth'; }
}

const FBar = Bar as IFeatureClass<IBar>


interface IBazz{
bazzMeth: ()=>Promise<void>;
}

class Bazz extends Feature(){
  static applyFeature(Base: Constructor){
    return class extends Base{
      async bazzMeth(){ }
      constructor(... args: any[]){
        super(... args);
        pushv(this, 'Bazz');
      }
    }
  }
}

const FBazz = Bazz as IFeatureClass<IBazz>;

class Foo extends WithFeatures( Object, FBar, FBazz ){}

describe('feature', ()=>{
  const foo = new Foo();
  test('basic', ()=>{
    expect(foo.attr).toEqual('bar');
    expect(foo.meth()).toEqual('meth');
    expect((foo as any).pushed).toEqual('Bar Bazz');
    expectTypeOf<Foo>().toHaveProperty('bazzMeth').toEqualTypeOf<IBazz['bazzMeth']>();
    expectTypeOf<Foo>().toHaveProperty('meth').toEqualTypeOf<IBar['meth']>();
  });
});
