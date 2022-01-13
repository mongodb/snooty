import React from 'react';
import { shallow } from 'enzyme';
import mockData from './data/Time.test.json';
import Time from '../../src/components/Time';

it('renders correctly', () => {
  const wrapper = shallow(<Time nodeData={mockData} />);
  expect(wrapper).toMatchSnapshot();
});
