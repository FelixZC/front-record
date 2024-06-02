import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ConditionalComponent from './ConditionalComponent';

test('displays loading state initially', () => {
  const { getByText } = render(<ConditionalComponent />);
  expect(getByText('Loading...')).toBeInTheDocument();
});

test('displays success message after loading', async () => {
  jest.useFakeTimers(); // 使用虚拟计时器加速测试
  const { getByText, queryByText } = render(<ConditionalComponent />);
  
  // 快进时间
  jest.runAllTimers();
  
  await waitFor(() => expect(queryByText('Loading...')).toBeNull());
  expect(getByText('Data fetched successfully')).toBeInTheDocument();
});