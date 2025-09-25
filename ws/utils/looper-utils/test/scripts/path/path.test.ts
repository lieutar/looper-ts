import { expect, describe, test } from 'vitest';
import { posixifyPath, canonicalizeDirectoryPath } from '@src/index';

describe('util/path', () => {

  test('posixifyPath', ()=>{
    expect(posixifyPath('foo\\bar\\bazz')).toBe('foo/bar/bazz');
  });

  test('canonicalizeDirectoryPath', ()=>{
    expect(canonicalizeDirectoryPath('foo/bar/bazz')).toBe('foo/bar/bazz');
    expect(canonicalizeDirectoryPath('foo/bar/bazz/')).toBe('foo/bar/bazz');
  });

});
