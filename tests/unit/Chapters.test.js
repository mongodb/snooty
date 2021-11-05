import React from 'react';
import { shallow } from 'enzyme';
import mockData from './data/Chapters.test.json';
import Chapters from '../../src/components/Chapters';

it('renders correctly', () => {
  const wrapper = shallow(<Chapters nodeData={mockData.nodeData} metadata={mockData.metadata} />);
  expect(wrapper).toMatchSnapshot();
});
