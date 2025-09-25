import type { Constructor, PExcept, PPick, ValuesOf } from '@src/types';
import { describe, expectTypeOf, test } from 'vitest'

describe('types', ()=>{
  test('PPick', ()=>{
    type User = { name: string; age: number; };
    type PPickUser = PPick<User, 'name'>;
    expectTypeOf<PPickUser>().toHaveProperty('name').toEqualTypeOf<string>();
    expectTypeOf<PPickUser>().toHaveProperty('age').toEqualTypeOf<number | undefined>();

    // @ts-expect-error:
    const invalidUser: PPickUser = { age: 20 };
  });

  test('PExcept', ()=>{
    type UserWithId = { id: number; name: string; age: number; };
    type PExceptUser = PExcept<UserWithId, 'age'>;
    expectTypeOf<PExceptUser>().toHaveProperty('id').toEqualTypeOf<number | undefined>();
    expectTypeOf<PExceptUser>().toHaveProperty('name').toEqualTypeOf<string | undefined>();
    // @ts-expect-error:
    const invalidExcept: PExceptUser = { age: 30 };
  });

  test('Constructor', ()=>{
    class MyClass {
      constructor(public value: string) {}
    }
    const myClassConstructor: Constructor<MyClass> = MyClass;
    // @ts-expect-error:
    const notAConstructor: Constructor<MyClass> = {};
  });

  test('ValueOf', ()=>{
    type Car = { brand: 'toyota'; model: 'corolla'; year: 2022; };
    type CarValues = ValuesOf<Car>;
    expectTypeOf<CarValues>().toEqualTypeOf<'toyota' | 'corolla' | 2022>();
    // @ts-expect-error:
    const invalidCarValue: CarValues = 'suzuki';
  });
});
