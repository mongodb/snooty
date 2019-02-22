import React from 'react';
import { shallow } from 'enzyme';
import Index from '../src/templates/index';

// data for this component
import mockData from "./data/index.test.json";

it('renders correctly', () => {
  const tree = shallow(<Index pageContext={ { __refDocMapping: mockData } } />);
  expect(tree).toMatchSnapshot();
});
