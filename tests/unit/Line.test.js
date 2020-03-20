import React from 'react';
import { shallow } from 'enzyme';
import Line from '../../src/components/Line';

// data for this component
import mockData from './data/Line.test.json';

it('renders correctly', () => {
  const tree = shallow(<Line nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
