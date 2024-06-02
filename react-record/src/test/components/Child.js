// Child.js
import React from 'react';

const Child = ({ onEvent }) => (
  <button onClick={() => onEvent('Hello from Child!')}>
    Click me
  </button>
);

export default Child;