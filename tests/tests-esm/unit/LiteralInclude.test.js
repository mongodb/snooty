import React from 'react';
import { render } from '@testing-library/react';
import LiteralInclude from '../../src/components/LiteralInclude';

// data for this component
import mockData from './data/LiteralInclude.test.json';

it('renders correctly', () => {
  const tree = render(<LiteralInclude nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
