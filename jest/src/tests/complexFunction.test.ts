
// src/__tests__/complexFunction.test.ts
import { complexFunction } from '../examples/complexFunction';

test.each([
    [1, 'positive odd'],
    [2, 'positive even'],
    [-1, 'negative'],
    [0, 'zero'],
])('identifies the type of number: %i', (input, expected) => {
    expect(complexFunction(input)).toBe(expected);
});