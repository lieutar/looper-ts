import {expect, test, describe} from 'vitest';
import { PseudoFile } from '@src/fs/mock/PseudoFile';
import { PseudoFs } from '@src/fs/mock/PseudoFs';

describe( 'PseudoFs' , ()=>{
  test('mockMkdir', async ()=>{
    const fs = await PseudoFs.fromSpec({});
    await fs.mockMkdir('/foo/bar/bazz/hoge', {recursive: true});
    expect(fs.queryFile(['foo']).node instanceof PseudoFile).toBe(true);
    expect(fs.queryFile(['foo', 'bar', 'bazz', 'hoge']).node instanceof PseudoFile).toBe(true);
  });
});
