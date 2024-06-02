import React from 'react';
import { render } from '@testing-library/react';
import MyComponent from './MyComponent';
import { ThemeProvider, useTheme } from './ThemeContext';

test('renders theme from context', () => {
  const { getByText } = render(
    <ThemeProvider value="dark">
      <MyComponent />
    </ThemeProvider>
  );

  expect(getByText('The theme is dark')).toBeInTheDocument();
});