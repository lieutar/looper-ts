import { makeExcpectDOM, makeManager } from "@src/test";
import { describe, expect, test } from "vitest";
import type { GenericCNode } from "@src/components";

describe('GeneticCNode', ()=>{
  const man = makeManager();
  const expectDOM = makeExcpectDOM(man);
  test('generate', async ()=>{
    const gen = man.create((({c})=>c(['div', {class: 'foo'}, 'bar'])));
    expectDOM(await gen.getWholeNodes()).toEqual([['DIV', {class: 'foo'}, 'bar']]);
  });

  test('nested', async ()=>{
    const gen = man.create(({c})=>c(['div', c('foo',['div'])])) as GenericCNode;
    expect([... gen.placeholders].map(ph=>ph.name)).toEqual(['foo']);
  });
});
