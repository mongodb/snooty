import React from 'react';
import { shallow } from 'enzyme';
import Emphasis from '../src/components/Emphasis';

// data for this component
import mockData from './data/Emphasis.test.json';

it('renders correctly', () => {
  const tree = shallow(<Emphasis nodeData={ mockData } />);
  expect(tree).toMatchSnapshot();
});
