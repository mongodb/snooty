import React from 'react';
import { shallow } from 'enzyme';
import Code from '../src/components/Code';

// data for this component
import mockData from './data/Code.test.json';

it('renders correctly', () => {
  const tree = shallow(<Code nodeData={ mockData } />);
  expect(tree).toMatchSnapshot();
});
