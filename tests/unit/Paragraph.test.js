import React from 'react';
import { render } from '@testing-library/react';
import Paragraph from '../../src/components/Paragraph';

// data for this component
import mockData from './data/Paragraph.test.json';

it('renders correctly', () => {
  const tree = render(<Paragraph nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
