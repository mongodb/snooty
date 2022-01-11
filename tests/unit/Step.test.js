import React from 'react';
import { render } from '@testing-library/react';
import Step from '../../src/components/Step';

// data for this component
import mockData from './data/Step.test.json';

it('renders correctly', () => {
  const tree = render(<Step nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
