// Counter.test.js
import React from 'react';
import { mount } from 'enzyme';
import Counter from './Counter';

it('increments the count when button is clicked', () => {
  const wrapper = mount(<Counter />);
  wrapper.find('button').simulate('click');
  expect(wrapper.text()).toContain('Count: 1');
});