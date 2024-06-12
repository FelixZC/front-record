// src/calculator.ts
export function add(a: number, b: number): number {
  return a + b;
}

// src/calculator.ts
export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

// src/__tests__/calculator.test.ts
test('throws an error when dividing by zero', () => {
  expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
});