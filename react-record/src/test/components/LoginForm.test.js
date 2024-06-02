// LoginForm.test.js
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import LoginForm from './LoginForm';

test('handles form submission and validation', () => {
  render(<LoginForm />);
  
  const usernameInput = screen.getByPlaceholderText('Username');
  const passwordInput = screen.getByPlaceholderText('Password');
  const submitButton = screen.getByText('Login');

  fireEvent.change(usernameInput, { target: { value: 'Alice' } });
  fireEvent.change(passwordInput, { target: { value: '' } });

  fireEvent.click(submitButton);
  expect(screen.getByText('Please fill all fields.')).toBeInTheDocument();

  // 清空警告，重新填写密码
  fireEvent.click(screen.getByRole('alert'));
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  fireEvent.click(submitButton);
  // 这里可以添加额外的断言来验证表单提交后的行为，比如API调用的模拟
});