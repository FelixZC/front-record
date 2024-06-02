import React, { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => this.setState(prevState => ({ count: prevState.count + 1 }));

  render() {
    return (
      <div>
        <button onClick={this.increment}>+</button>
        <p>Count: {this.state.count}</p>
      </div>
    );
  }
}

export default Counter;