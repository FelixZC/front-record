import { wait } from '../examples/timer';

test('waits for the specified time', async () => {
  const start = Date.now();
  await wait(100);
  const end = Date.now();
  expect(end - start).toBeGreaterThanOrEqual(100);
});