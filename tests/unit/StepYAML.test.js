import React from 'react';
import { render } from '@testing-library/react';
import StepYAML from '../../src/components/StepYAML';

// data for this component
import mockData from './data/StepYAML.test.json';

it('renders correctly', () => {
  const tree = render(<StepYAML nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
