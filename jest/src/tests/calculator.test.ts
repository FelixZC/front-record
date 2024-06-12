// src/__tests__/calculator.test.ts
import { add } from '../examples/calculator';

describe('Calculator', () => {
  it('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('adds negative numbers correctly', () => {
    expect(add(-1, -1)).toBe(-2);
  });
});

test('adds 0 to any number', () => {
  expect(add(0, 10)).toBe(10);
  expect(add(10, 0)).toBe(10);
});

test('adds negative numbers', () => {
  expect(add(-1, -1)).toBe(-2);
});