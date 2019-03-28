import React from 'react';
import { shallow } from 'enzyme';
import LiteralInclude from '../../src/components/LiteralInclude';

// data for this component
import mockData from './data/LiteralInclude.test.json';
import refDocMapping from './data/site/__testData.json';

it('renders correctly', () => {
  const tree = shallow(<LiteralInclude nodeData={mockData} refDocMapping={refDocMapping} />);
  expect(tree).toMatchSnapshot();
});
