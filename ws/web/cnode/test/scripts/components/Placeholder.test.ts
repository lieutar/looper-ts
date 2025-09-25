import { Placeholder } from "@src/components";
import { makeDOMTools, makeManager } from "@src/test";
import { describe, expect, test } from "vitest";


describe('Placeholder', ()=>{
  const man  = makeManager();
  const {expectDOM, trimmedDomlibDSL} = makeDOMTools(man);

  test('basic', async () => {
    const ph = man.create(({$$})=>$$('foo').forceBuild()) as Placeholder;
    expect(ph).toBeInstanceOf(Placeholder);
    await ph.setEntities(man.createSome(({F})=>F('foo')));
    const nodes = await ph.getWholeNodes();
    expectDOM(nodes).toEqual([
      [ "SCRIPT", {
        type: "application/x-cnode-ph-begin",
        name: "foo",
      } ],
      ['SPAN', 'foo'],
      [ "SCRIPT", {
        type: "application/x-cnode-ph-end",
        name: "foo",
      } ] ]);
  });

  test('with components', async () => {
    const ph = man.create(({$$})=>$$({
      name: "hoge",
      cond: ()=>false
    }, 'foo', 'bar').forceBuild()) as Placeholder;
    expectDOM(await ph.getWholeNodes()).toEqual([
      [ "SCRIPT", {
        type: "application/x-cnode-ph-begin",
        name: "hoge"
      }],
      ["SPAN", "foo" ],
      ["SPAN", "bar"],
      [ "SCRIPT", {
        type: "application/x-cnode-ph-end",
        name: "hoge"
      }]
    ]);
    await ph.updateVisibility((_:any)=>null);
    expectDOM(await ph.getWholeNodes()).toEqual([
      [ "SCRIPT", {
        type: "application/x-cnode-ph-begin",
        name: "hoge"
      }],
      [ "SCRIPT", {
        type: "application/x-cnode-ph-end",
        name: "hoge"
      }]
    ]);
  });

  test('with a condition, but no name', async () => {
    const ph = man.create(({$$})=>$$({cond: ()=>false}, 'foo', 'bar').forceBuild()) as Placeholder;
    let dsl = trimmedDomlibDSL(await ph.getWholeNodes());
    expect(dsl.length).toBe(4);
    dsl.shift();dsl.pop();
    expect(dsl).toEqual([['SPAN', 'foo'],['SPAN','bar']]);
    await ph.updateVisibility((_:any)=>null);
    dsl = trimmedDomlibDSL(await ph.getWholeNodes());
    expect(dsl.length).toBe(2);
  });

});
