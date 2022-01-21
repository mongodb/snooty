import React from 'react';
import { render } from '@testing-library/react';
import Heading from '../../src/components/Heading';

// data for this component
import mockData from './data/Heading.test.json';

it('renders correctly', () => {
  const tree = render(<Heading nodeData={mockData} sectionDepth={3} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
