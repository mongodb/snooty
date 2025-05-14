import React from 'react';
import { render } from '@testing-library/react';
import List from '../../src/components/List';

// data for this component
import mockData from './data/List.test.json';

it('List renders correctly', () => {
  const tree = render(<List nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
