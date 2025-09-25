import { AutoInit , Init, makeMixer, qoop, Trait, TraitProp, WithTraits, type ExtractTraitInterface
} from "@src/index";
import { describe, expect, expectTypeOf, test } from "vitest";

interface IFoo{
  get FOO(): string;
  get foo(): string;
  setFoo(foo:string):void;
}

@Trait()
@AutoInit()
@qoop()
class Foo {
  @TraitProp() readonly FOO:IFoo['FOO'] = 'FOO value';
  @TraitProp() @Init() declare foo: IFoo['foo'];
  setFoo(foo:string){ this.foo = foo; }
}

const TFoo = makeMixer<IFoo>(Foo);


@qoop({Trait:{}, AutoInit:{}})
class Bar {
  @TraitProp() @Init() declare bar: string;
  barMethod(something:string){ return `bar ${something}`; };
}

const TBar = makeMixer<Bar>(Bar);

const SuperHoge =  WithTraits(Object, TFoo, TBar);
class Hoge extends SuperHoge {}

describe('Trait', ()=>{
  test('basic', ()=>{
    const hoge = new Hoge({foo: 'foo value', bar: 'bar value'});
    expect(hoge.FOO).toEqual('FOO value');
    expect(hoge.foo).toEqual('foo value');
    expect(hoge.bar).toEqual('bar value');
    expect(hoge.barMethod('hoge')).toEqual('bar hoge');
    hoge.setFoo('new foo');
    expect(hoge.foo).toEqual('new foo');
  });

  //*///
  test('types', ()=>{
    expectTypeOf<ExtractTraitInterface<typeof TFoo>>().toEqualTypeOf<IFoo>();
    expectTypeOf<ExtractTraitInterface<typeof TBar>>().toEqualTypeOf<Bar>();
  });
  //*///
});
