import { renderHook, act, waitFor } from '@testing-library/react-hooks';
import useFetch from './useFetch';

test('fetches data from url', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useFetch('https://api.example.com/data'));

  expect(result.current.loading).toBe(true);
  expect(result.current.data).toBe(null);
  expect(result.current.error).toBe(null);

  await waitForNextUpdate(); // 等待Hook内部的状态更新

  expect(result.current.loading).toBe(false);
  expect(result.current.data).toBeTruthy(); // 或者有更具体的断言来检查data的内容
  expect(result.current.error).toBe(null);
});