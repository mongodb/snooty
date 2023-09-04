import React from 'react';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import BlockQuote from '../../src/components/BlockQuote';

// data for this component
import mockData from './data/BlockQuote.test.json';

beforeAll(() => {
  mockLocation(null, `/`);
});

it('renders correctly', () => {
  const tree = render(<BlockQuote nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
