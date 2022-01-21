import React from 'react';
import { render } from '@testing-library/react';
import Button from '../../src/components/Button';

// data for this component
import mockData from './data/Button.test.json';

it('renders correctly', () => {
  const tree = render(<Button nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
