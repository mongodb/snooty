import React from 'react';
import { shallow } from 'enzyme';
import Banner from '../../src/components/Banner';

// data for this component
import mockData from './data/Banner.test.json';

it('renders a Banner correctly', () => {
  const tree = shallow(<Banner nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
