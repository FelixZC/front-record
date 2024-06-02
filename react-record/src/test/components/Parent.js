// Parent.js
import React from 'react';
import Child from './Child';

const Parent = () => {
  const handleChildEvent = (message) => {
    console.log(message);
  };

  return <Child onEvent={handleChildEvent} />;
};

export default Parent;

