import { expect, describe, test } from 'vitest';
import { quotemeta } from '@src/index';

describe( "util/string" , ()=>{
  test( "quotemeta" , () =>{
    expect(quotemeta("")).toBe("");
    expect(quotemeta("foo.txt")).toBe('foo\\.txt');
    expect(quotemeta("{[a(b)c]}")).toBe('\\{\\[a\\(b\\)c\\]\\}');
  });
});
