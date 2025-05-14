import React from 'react';
import { render } from '@testing-library/react';
import FootnoteReference from '../../src/components/Footnote/FootnoteReference';

// data for this component
import mockData from './data/FootnoteReference.test.json';

it('renders correctly', () => {
  const tree = render(<FootnoteReference nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
