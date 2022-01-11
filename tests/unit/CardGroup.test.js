import React from 'react';
import { render } from '@testing-library/react';
import CardGroup from '../../src/components/CardGroup';

// data for this component
import mockData from './data/CardGroup.test.json';

it('renders correctly', () => {
  const tree = render(<CardGroup nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
