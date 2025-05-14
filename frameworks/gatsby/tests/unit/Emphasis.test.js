import React from 'react';
import { render } from '@testing-library/react';
import Emphasis from '../../src/components/Emphasis';

// data for this component
import mockData from './data/Emphasis.test.json';

it('renders correctly', () => {
  const tree = render(<Emphasis nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
