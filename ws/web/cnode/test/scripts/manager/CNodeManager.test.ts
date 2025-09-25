import { CNodeManager } from '@src/index';
import { makeManager } from '@src/test';
import { describe, expect, test } from 'vitest';

describe('CNodeManager', ()=>{
  const man = makeManager();
  test('basic',  ()=>{ expect(man instanceof CNodeManager).toBe(true); });
  test('gensym', ()=>{ expect(man.gensym()).not.toEqual(man.gensym()); });
  describe('TBuilder', ()=>{
    const frgm = man.create(({F})=>F('foo'));
    expect(frgm.length).toEqual(1);
  });
});
