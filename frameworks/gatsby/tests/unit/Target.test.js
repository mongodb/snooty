import React from 'react';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import Target from '../../src/components/Target';

// data for this component
import mockData from './data/Target.test.json';

beforeAll(() => {
  mockLocation(null, `/`);
});

it('renders correctly with a directive_argument node', () => {
  const tree = render(<Target nodeData={mockData.a} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders correctly with no directive_argument nodes', () => {
  const tree = render(<Target nodeData={mockData.b} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
