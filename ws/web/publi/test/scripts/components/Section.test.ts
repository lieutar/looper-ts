import { Section } from '@src/index';
import { PubliTestContext } from '@src/test';
import type { CNodeManager } from 'cnode';
import { describe, expect, test } from 'vitest';

describe('Section', ()=>{

  test('TPartsHolder, TTemplateHolder', async ()=>{
    const tcx = new PubliTestContext();
    const man = tcx.manager;
    const $sec = Section.build.bind(Section, tcx.publi);
    const allFields = 'title header headNav article footer footNav'.split(' ');
    const sec = (man.create as CNodeManager['create'])(({F,c, $$})=>$sec({
      title:   F('title!'),
      header:  F('header!'),
      headNav: F('headNav!'),
      article: F('article!'),
      footer:  F('footer!'),
      footNav: F('footNav!'),
      template: c(['div',$$('title'), $$('header'), $$('headNav'), $$('article'), $$('footer'), $$('footNav')])
    })) as Section;
    for(const f of allFields){
      expect(await tcx.componentsToDSL(sec[f as keyof Section])).toEqual([['SPAN', `${f}!`]]);
    }
    const nodes = await sec.getWholeNodes();
    tcx.expectDOM(nodes).toEqual([['DIV', ... allFields.map(f => ([
      ['SCRIPT', {name: f, type: 'application/x-cnode-ph-begin'}],
      ['SPAN', `${f}!`],
      ['SCRIPT', {name: f, type: 'application/x-cnode-ph-end'}]
    ])).flat(1)]]);
    //*///
  });

  test('TSectionDepthCalculator', ()=>{
    const tcx = new PubliTestContext();
    const man = tcx.manager;
    const $sec = Section.build.bind(Section, tcx.publi);
    const sec0 = (man.create as CNodeManager['create'])(({})=>$sec({})) as Section;
    const sec1 = (man.create as CNodeManager['create'])(({})=>$sec({})) as Section;
    const sec2 = (man.create as CNodeManager['create'])(({})=>$sec({})) as Section;
    const sec3 = (man.create as CNodeManager['create'])(({})=>$sec({})) as Section;
    sec0.addChildren('article',sec1);
    sec1.addChildren('article',sec2);
    sec2.addChildren('article',sec3);
    expect(sec0.depth).toEqual(0);
    expect(sec1.depth).toEqual(1);
    expect(sec2.depth).toEqual(2);
    expect(sec3.depth).toEqual(3);
  });
});
