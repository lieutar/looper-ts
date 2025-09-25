import { TextCNode } from "@src/components";
import { makeExcpectDOM, makeManager } from "@src/test";
import { describe, expect, test } from "vitest";

describe('TextCNode', ()=>{
  const man = makeManager();
  const expectDOM = makeExcpectDOM(man);
  test('basic', async ()=>{
    const tn  = man.create(({$})=>$('foo').forceBuild());
    expect(tn).toBeInstanceOf(TextCNode);
    expect(tn.name).toBe('foo');
    expectDOM( await tn.getWholeNodes() ).toEqual([['SPAN', 'undefined']]);
  });
});
