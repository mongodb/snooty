import React from 'react';
import { render } from '@testing-library/react';
import Admonition from '../../src/components/Admonition';

// data for this component
import mockData from './data/Admonition.test.json';

it('admonitions render correctly', () => {
  const tree = render(<Admonition nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
