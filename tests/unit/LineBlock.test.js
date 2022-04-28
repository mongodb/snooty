import React from 'react';
import { render } from '@testing-library/react';
import LineBlock from '../../src/components/LineBlock';

// data for this component
import mockData from './data/Literal.test.json';

it('renders correctly', () => {
  const tree = render(<LineBlock nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
