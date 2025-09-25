import { Section } from "@src/components";
import { SectionTemplateResolver } from "@src/templateResolvers";
import { PubliTestContext } from "@src/test";
import type { CNodeManager, GenericCNode } from "cnode";
import type { NodeSpecType } from "domlib";
import { describe, test } from "vitest";

describe('SectionTemplateResolver', ()=>{
  test('With Vanilla', async ()=>{
    const tcx = new PubliTestContext();
    const man : CNodeManager = tcx.manager;
    const publi = tcx.publi;
    const $sec = Section.build.bind(Section, publi);
    const sr:SectionTemplateResolver   = SectionTemplateResolver.vanilla();
    const sec0 = man.create(({})=>$sec({})) as Section;
    const sec1 = man.create(({})=>$sec({})) as Section;
    const sec2 = man.create(({})=>$sec({})) as Section;
    const sec3 = man.create(({})=>$sec({})) as Section;
    const sec4 = man.create(({})=>$sec({})) as Section;
    const sec5 = man.create(({})=>$sec({})) as Section;
    const sec6 = man.create(({})=>$sec({})) as Section;
    const sec7 = man.create(({})=>$sec({})) as Section;
    const sec8 = man.create(({})=>$sec({})) as Section;
    sec0.addChildren('article',sec1);
    sec1.addChildren('article',sec2);
    sec2.addChildren('article',sec3);
    sec3.addChildren('article',sec4);
    sec4.addChildren('article',sec5);
    sec5.addChildren('article',sec6);
    sec6.addChildren('article',sec7);
    sec7.addChildren('article',sec8);

    function ph(name:string, ... content:NodeSpecType[]){
      return [
        [ "SCRIPT", {"type": "application/x-cnode-ph-begin", "name": name } ],
        ... content,
        [ "SCRIPT", {"type": "application/x-cnode-ph-end",   "name": name } ]
      ] as NodeSpecType[]
    }

    for(const [sec, ... head] of [
      [sec0, 'H2'], [sec1, 'H3'], [sec2, 'H4'], [sec3, 'H5'], [sec4, 'H6'],
      [sec5, 'P', {class: 'heading heading-7'}],[sec6, 'P', {class: 'heading heading-8'}],
      [sec7, 'P', {class: 'heading heading-9'}]]){
        const g = man.create( sr.resolve(sec as Section) ) as GenericCNode;
        tcx.expectDOM(await g.getWholeNodes()).toEqual([
          ["SECTION",
            ["HEADER",
              [...head, ... ph('title') ],
              ["DIV", { "class": "info" }, ... ph('header') ],
              ["NAV", ... ph('headNav') ] ],
            ["ARTICLE", ... ph('article') ],
            ["FOOTER",
              ["NAV", ... ph('footNav') ],
              ["DIV", { "class": "info" }, ... ph('footer') ] ] ]
        ]);
      }
  });
});
