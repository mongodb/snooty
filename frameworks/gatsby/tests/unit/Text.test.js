import React from 'react';
import { render } from '@testing-library/react';
import Text from '../../src/components/Text';

// data for this component
import mockData from './data/Text.test.json';

it('renders correctly', () => {
  const tree = render(<Text nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
