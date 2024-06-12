import { renderComponent } from '../examples/component';

test('renders the component correctly', () => {
  expect(renderComponent()).toMatchSnapshot();
});