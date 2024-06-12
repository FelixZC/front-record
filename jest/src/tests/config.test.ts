import { getConfig } from '../examples/config';

test('reads the configuration correctly', () => {
  process.env.MY_CONFIG = 'test_value';
  expect(getConfig()).toBe('test_value');
});