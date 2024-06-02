// Greeting.test.js
import React from 'react';
import { shallow } from 'enzyme';
import Greeting from './Greeting';
import { render, screen , fireEvent} from '@testing-library/react';

it('renders correctly with a name', () => {
  const wrapper = shallow(<Greeting name="Alice" />);
  expect(wrapper.text()).toEqual('Hello, Alice!');
});

test('renders greeting with provided name', () => {
  render(<Greeting name="Bob" />);
  const greetingElement = screen.getByText(/Hello, Bob!/i);
  expect(greetingElement).toBeInTheDocument();
});

test('increments count on button click', () => {
  const { getByText } = render(<Counter />);
  const button = getByText('+');
  const countElement = getByText('Count: 0');

  fireEvent.click(button);
  expect(countElement).toHaveTextContent('Count: 1');
});