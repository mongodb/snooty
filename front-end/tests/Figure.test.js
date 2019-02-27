import React from 'react';
import { shallow } from 'enzyme';
import Figure from '../src/components/Figure';

// data for this component
import mockData from './data/Figure.test.json';

it('renders correctly', () => {
  const tree = shallow(<Figure nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
