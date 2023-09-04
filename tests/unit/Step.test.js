import React from 'react';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import Step from '../../src/components/Procedure/Step';

// data for this component
import mockData from './data/Step.test.json';

beforeAll(() => {
  mockLocation(null, `/`);
});

it('renders with "connected" styling by default', () => {
  const tree = render(<Step nodeData={mockData} stepNumber={1} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders with "connected" styling', () => {
  const tree = render(<Step nodeData={mockData} stepStyle="connected" stepNumber={1} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders with "normal" or YAML steps styling', () => {
  const tree = render(<Step nodeData={mockData} stepStyle="normal" stepNumber={1} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
