import { combineFilter } from '@lib/jssutils';
import { expect, describe, test } from 'bun:test';

describe('jssutils filter', ()=>{
  test('blur', ()=>{
    expect(combineFilter({blur:8})).toEqual('blur(8px)');
  })
});
