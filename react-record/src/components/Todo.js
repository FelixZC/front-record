import React, { useState } from 'react';
import Fade from './Fade';
import TransitionGroup from './TransitionGroup';
function Todo() {
  const [items, setItems] = useState(['Item 1', 'Item 2']);

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`]);
  };

  const removeLastItem = () => {
    setItems(items.slice(0, -1));
  };

  const onEnter = node => {
    node.style.opacity = 0;
  };

  const onExit = (node, done) => {
    node.style.opacity = 1;
    setTimeout(() => {
      done();
      node.style.display = 'none';
    }, 300);
  };

  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      <button onClick={removeLastItem}>Remove Item</button>
      <TransitionGroup>
        {items.map((item, index) => (
          <Fade key={index} in={true} onEnter={onEnter} onExit={onExit}>
            {item}
          </Fade>
        ))}
      </TransitionGroup>
    </div>
  );
}

export default Todo;