import React from 'react';
import { render } from '@testing-library/react';
import BlockQuote from '../../src/components/BlockQuote';

// data for this component
import mockData from './data/BlockQuote.test.json';

it('renders correctly', () => {
  const tree = render(<BlockQuote nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
