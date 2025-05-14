import React from 'react';
import { render } from '@testing-library/react';
import TitleReference from '../../src/components/TitleReference';

// data for this component
import mockData from './data/TitleReference.test.json';

it('renders correctly', () => {
  const tree = render(<TitleReference nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
