import React from 'react';
import { render } from '@testing-library/react';
import Literal from '../../src/components/Literal';

// data for this component
import mockData from './data/Literal.test.json';

it('renders correctly', () => {
  const tree = render(<Literal nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
