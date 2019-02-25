import React from 'react';
import { shallow } from 'enzyme';
import Include from '../src/components/Include';

// data for this component
import mockData from './data/Include.test.json';

it('renders correctly', () => {
  const tree = shallow(<Include nodeData={ mockData } />);
  expect(tree).toMatchSnapshot();
});
