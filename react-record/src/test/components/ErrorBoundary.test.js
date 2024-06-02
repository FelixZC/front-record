import React from 'react';
import { render } from '@testing-library/react';
import ErrorBoundaryWrapper from './ErrorBoundary';

// 故意抛出错误的组件
const Bomb = () => {
  throw new Error('Boom!');
};

test('renders error fallback when child throws', () => {
  const { getByText } = render(
    <ErrorBoundaryWrapper>
      <Bomb />
    </ErrorBoundaryWrapper>
  );

  expect(getByText(/Error: Boom!/i)).toBeInTheDocument();
});