import React from 'react';
import { shallow } from 'enzyme';
import Line from '../../src/components/Line';

// data for this component
import mockData from './data/Line.test.json';
import mockData2 from './data/Line-empty.test.json';

it('renders correctly', () => {
  const tree = shallow(<Line nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});

it('renders an empty Line node correctly', () => {
  const tree = shallow(<Line nodeData={mockData2} />);
  expect(tree).toMatchSnapshot();
});
