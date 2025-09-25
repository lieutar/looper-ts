import { test, expect, describe } from 'vitest';
import { MemoryResponseWriter } from '@src/writer/MemoryResponseWriter';

// TODO this script is just a STUB.

describe( 'MamoryResponseWriter' , () =>{
  const mrw = new MemoryResponseWriter();
  test('initial state', ()=>{
    expect(mrw.storedStatus).toBe(200);
  });
});
