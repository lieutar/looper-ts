import { qoop } from "@src/index";
import {  getImpl, getQoopMetaInfo } from '@src/qoop/utils';
import type { Constructor } from "looper-utils";
import { describe, expect, test } from "vitest";

function B(){
  return <T extends Constructor>(Base:T)=>{
    const meta = getQoopMetaInfo(Base.prototype);
    const iproto = getImpl(Base.prototype);
    return class extends Base{
      meta = meta;
      iproto = iproto;
    };
  }
}

function A(){
  return <T extends Constructor>(Base:T)=>{
    return class extends Base{
    };
  }
}

@B()
@A()
@qoop({meta:'info'})
class Foo{
  get foo(){ return 'foo value' }
  declare meta: any;
  declare iproto: any;
}


describe( 'qoop', ()=>{
  test('basic', ()=>{
    const foo = new Foo();
    expect(foo.meta).toEqual('info');
    expect((foo.iproto || {}).foo).toEqual('foo value');
  });
});
