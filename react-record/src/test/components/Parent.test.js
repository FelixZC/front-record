import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Parent from './Parent';

test('handles child event correctly', () => {
  const mockHandleChildEvent = jest.fn();
  
  // 使用自定义渲染函数来捕获mock函数
  const { getByText } = render(<Parent onEvent={mockHandleChildEvent} />);

  const button = getByText('Click me');
  fireEvent.click(button);

  expect(mockHandleChildEvent).toHaveBeenCalledWith('Hello from Child!');
});
