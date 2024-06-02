import React, { useEffect, useRef } from 'react';

const Fade = ({ children, in: inProp, onEnter, onExit, timeout = 300 }) => {
  const nodeRef = useRef();
  
  useEffect(() => {
    if (inProp) {
      onEnter(nodeRef.current);
      setTimeout(() => {
        nodeRef.current.style.opacity = 1;
      }, 10);
    } else {
      onExit(nodeRef.current, () => {
        nodeRef.current.style.opacity = 0;
      });
    }
  }, [inProp, onEnter, onExit]);

  return (
    <div 
      ref={nodeRef}
      style={{
        opacity: inProp ? 1 : 0,
        transition: `opacity ${timeout}ms ease-in-out`,
      }}
    >
      {children}
    </div>
  );
};

export default Fade;