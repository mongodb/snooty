import React from 'react';
import { shallow } from 'enzyme';
import Admonition from '../src/components/Admonition';

// data for this component
import mockData from './data/Admonition.test.json';

it('renders correctly', () => {
  const tree = shallow(<Admonition nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});