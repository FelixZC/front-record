// src/__tests__/counter.test.ts
import { increment } from '../examples/counter';
let count = 0;

beforeEach(() => {
  // 重置全局状态
  count = 0;
});

test('increments the count', () => {
  expect(increment()).toBe(1);
  expect(increment()).toBe(2);
  expect(count).toBe(2); // 测试副作用
});