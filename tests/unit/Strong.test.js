import React from 'react';
import { render } from '@testing-library/react';
import Strong from '../../src/components/Strong';

// data for this component
import mockData from './data/Strong.test.json';

it('renders correctly', () => {
  const tree = render(<Strong nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
