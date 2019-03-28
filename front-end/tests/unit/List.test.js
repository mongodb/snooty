import React from 'react';
import { shallow } from 'enzyme';
import List from '../../src/components/List';

// data for this component
import mockData from './data/List.test.json';

it('renders correctly', () => {
  const tree = shallow(<List nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
