import React from 'react';
import { render } from '@testing-library/react';
import Procedure from '../../src/components/Procedure';

// data for this component
import mockData from './data/Procedure.test.json';

it('renders correctly', () => {
  const tree = render(<Procedure nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
