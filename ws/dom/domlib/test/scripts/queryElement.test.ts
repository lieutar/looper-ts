import { asDocument } from '@src/dsl';
import { queryElement } from '@src/queryElement';
import { isElementNode } from '@src/types';
import { JSDOM } from 'jsdom';
import { describe, expect, test } from "vitest";

const window = new JSDOM().window;

describe('queryElement', ()=>{
  test('from document', ()=>{
    const doc = asDocument(window, ['foo', ['bar', ['bazz', 'hoge']]]);
    const result = queryElement({from: doc, path: ['foo', 'bar', 'bazz'], ignoreCase: true});
    expect(isElementNode(result)).toBe(true);
    expect(result!.textContent).toEqual('hoge');
  });
});
