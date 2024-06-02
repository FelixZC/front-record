import React, { Children } from 'react';

const TransitionGroup = ({ children }) => {
  return (
    <div>{Children.map(children, child => child)}</div>
  );
};

export default TransitionGroup;