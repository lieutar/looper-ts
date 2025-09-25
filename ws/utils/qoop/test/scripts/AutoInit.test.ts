import { Init, AutoInit, AfterInit } from "@src/index";
import { describe, expect, test } from "vitest";

@AutoInit({afterInit(this:any, _:any){ this.afterInitArg = true; }})
class Foo {
  @Init() declare p1: string;
  @Init('prop2') declare p2: string;
  @Init((params)=>(params as any).p3 ?? 'default p3') declare p3: string;
  afterInitByDecor:string[] = [];
  declare afterInitArg : boolean;
  constructor(_params:{}){}
  @AfterInit()
  protected foo(){ this.afterInitByDecor.push('foo'); }
  @AfterInit()
  protected bar(){ this.afterInitByDecor.push('bar'); }
}

describe('AutoInit', ()=>{
  test('basic', ()=>{
    const foo = new Foo({p1: 'p1-value', prop2: 'p2-value'});
    expect(foo.p1).toEqual('p1-value');
    expect(foo.p2).toEqual('p2-value');
    expect(foo.p3).toEqual('default p3');
    expect(foo.afterInitArg).toBe(true);
    expect(foo.afterInitByDecor).toEqual(['foo', 'bar']);
    const foo2 = new Foo({p3: 'p3-value'});
    expect(foo2.p3).toEqual('p3-value');
  });
});
