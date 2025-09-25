import { ZLayer } from '@lib/jssutils';
import { expect, describe, test } from 'bun:test';

describe( 'ZLayer', () => {
  test( 'The simplest case', ()=>{
    const b = new ZLayer();
    expect(b.isRoot).toBe(true);
    expect(b.isFg).toBe(false);
    expect(b.isBg).toBe(false);
    expect(b.index).toBe(0);
    expect(b.getSortedBgLayers()).toEqual([]);
    expect(b.getSortedFgLayers()).toEqual([]);
    expect(b.getSerializedLayers()).toEqual([b]);
  });

  test( 'With single fg', ()=>{
    const b = new ZLayer();
    const fg = b.fg();
    const fg2 = b.fg();
    expect(fg2).toBe(fg);
    expect(b.isRoot).toBe(true);
    expect(fg.isRoot).toBe(false);
    expect(fg.isFg).toBe(true);
    expect(fg.getSortedFgLayers()).toEqual([]);
    expect(fg.getSortedBgLayers()).toEqual([]);
    expect(fg.index).toBe(1);
  });

  test( 'With single bg', ()=>{
    const b = new ZLayer();
    const bg = b.bg();
    expect(bg.isRoot).toBe(false);
    expect(bg.isBg).toBe(true);
    expect(bg.isFg).toBe(false);
    expect(bg.index).toBe(-1);
  });

  test( 'With bg and fg', () => {
    const b = new ZLayer();
    const bg = b.bg();
    const fg = b.fg();
    expect(bg.isFg).toBe(false);
    expect(bg.isBg).toBe(true);
    expect(fg.isFg).toBe(true);
    expect(fg.isBg).toBe(false);
    expect([bg.index, b.index, fg.index]).toEqual([-1,0,1]);
  });

  test('nested', ()=>{
    const b   = new ZLayer();
    const bg  =  b.bg();
    const bg2 = bg.bg();
    const bgf = bg.fg();
    const fg  =  b.fg();
    const fg2 = fg.fg();
    const fgb = fg.bg();
    expect(b.getSerializedBgLayers()).toEqual([bg2, bg, bgf]);
    expect(b.getSerializedFgLayers()).toEqual([fgb, fg, fg2]);
    expect(bgf.isBg).toBe(true);
    expect(fgb.isFg).toBe(true);
    //expect([bg2, bg, bgf, b, fgb, fg, fg2].map(l=>l.index)).toEqual([-3,-2,-1,0,1,2,3]);
  });

});
