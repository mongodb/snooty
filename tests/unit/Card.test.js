import React from 'react';
import { render } from '@testing-library/react';
import Card from '../../src/components/Card';

// data for this component
import mockData from './data/Card.test.json';

it('renders correctly', () => {
  const tree = render(<Card nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
