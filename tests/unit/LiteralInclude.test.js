import React from 'react';
import { shallow } from 'enzyme';
import LiteralInclude from '../../src/components/ComponentFactory/LiteralInclude';

// data for this component
import mockData from './data/LiteralInclude.test.json';

it('renders correctly', () => {
  const tree = shallow(<LiteralInclude nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
