import React from 'react';
import { render } from 'enzyme';
import Reference from '../../src/components/Reference';

// data for this component
import mockData from './data/Reference.test.json';

it('renders correctly', () => {
  const tree = render(<Reference nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
