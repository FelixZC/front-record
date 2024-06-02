import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import UserList from './UserList';

// 模拟axios.get
jest.mock('axios');

beforeEach(() => {
  axios.get.mockResolvedValue({ data: [{ id: 1, name: 'Alice' }] });
});

test('fetches and displays user list', async () => {
  render(<UserList />);

  // 等待直到至少一个<li>元素出现在DOM中
  await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1));

  const userListItems = screen.getAllByRole('listitem');
  expect(userListItems).toHaveLength(1);
  expect(userListItems[0]).toHaveTextContent('Alice');
});