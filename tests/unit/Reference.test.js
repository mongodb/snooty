import React from 'react';
import { shallow } from 'enzyme';
import Reference from '../../src/components/Reference';

// data for this component
import mockData from './data/Reference.test.json';

it('renders correctly', () => {
  const tree = shallow(<Reference nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
