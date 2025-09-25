import { Delegate } from "@src/Delegate";
import { describe, expect, test } from "bun:test";

class Foo {
  fooField: string = 'foo-field-value';
  otherFooField:  string = 'other-foo-field';
  fooMethod(){ return 'foo-method-value'; }
  otherFooMethod(){ return 'other-method-value'; }
}

class Bar {
  foo: Foo = new Foo();
  @Delegate('foo', {get:true}) declare fooField : string;
  @Delegate('foo', {get:true, field: 'otherFooField'}) declare fooField2: string;
  @Delegate('foo') declare fooMethod: ()=>string;
  @Delegate('foo', 'otherFooMethod') declare fooMethod2: ()=>string;
}

describe( '@Delegate' , ()=>{
  test('basic', ()=>{
    const bar = new Bar();
    expect(bar.fooField).toEqual('foo-field-value');
    expect(bar.fooField2).toEqual('other-foo-field');
    expect(bar.fooMethod()).toEqual('foo-method-value');
    expect(bar.fooMethod2()).toEqual('other-method-value');
  });
});
