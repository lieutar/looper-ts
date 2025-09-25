import { expect, describe, test } from 'vitest';
import { isObject } from '@src/index';

describe('types', () => {
  test('isObject', () => {
    expect(isObject({})).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(NaN)).toBe(false);
    expect(isObject([])).toBe(true);
    expect(isObject(new Date())).toBe(true);
    expect(isObject(/./)).toBe(true);
  });
});
