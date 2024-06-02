import React, { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

export const ThemeProvider = ThemeContext.Provider;
export const useTheme = () => useContext(ThemeContext);

// MyComponent.js
import React from 'react';
import { useTheme } from './ThemeContext';

const MyComponent = () => {
  const theme = useTheme();
  return <div>The theme is {theme}</div>;
};

export default MyComponent;