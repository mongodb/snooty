import React from 'react';
import { render } from '@testing-library/react';
import Step from '../../src/components/Step';

// data for this component
import mockData from './data/Step.test.json';

it('renders with "connected" styling by default', () => {
  const tree = render(<Step nodeData={mockData} isLastStep={false} stepNumber={1} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders with "connected" styling', () => {
  const tree = render(<Step nodeData={mockData} stepStyle="connected" isLastStep={false} stepNumber={1} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders with "normal" or YAML steps styling', () => {
  const tree = render(<Step nodeData={mockData} stepStyle="normal" isLastStep={false} stepNumber={1} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
