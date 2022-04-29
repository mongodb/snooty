import React from 'react';
import { render } from '@testing-library/react';
import Line from '../../src/components/LineBlock/Line';

// data for this component
import mockData from './data/Line.test.json';
import mockData2 from './data/Line-empty.test.json';

it('renders correctly', () => {
  const tree = render(<Line nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders an empty Line node correctly', () => {
  const tree = render(<Line nodeData={mockData2} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
