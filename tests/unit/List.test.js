import React from 'react';
import { render } from 'enzyme';
import List from '../../src/components/List';

// data for this component
import mockData from './data/List.test.json';

it('List renders correctly', () => {
  const tree = render(<List nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
