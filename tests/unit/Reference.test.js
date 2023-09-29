import React from 'react';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import Reference from '../../src/components/Reference';

// data for this component
import mockData from './data/Reference.test.json';

beforeAll(() => {
  mockLocation(null, `/`);
});

it('renders correctly', () => {
  const tree = render(<Reference nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
