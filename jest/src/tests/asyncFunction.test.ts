import { asyncFunction } from '../examples/asyncFunction';

test('times out for long wait', async () => {
  await expect(asyncFunction(2000)).rejects.toThrow('timeout');
}, 1000); // 设置测试超时为1000ms