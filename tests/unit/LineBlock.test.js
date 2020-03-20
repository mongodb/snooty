import React from 'react';
import { shallow } from 'enzyme';
import LineBlock from '../../src/components/LineBlock';

// data for this component
import mockData from './data/Literal.test.json';

it('renders correctly', () => {
  const tree = shallow(<LineBlock nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
