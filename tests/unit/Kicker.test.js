import React from 'react';
import { shallow } from 'enzyme';
import Kicker from '../../src/components/landing/Kicker';

// data for this component
import mockData from './data/landing/Kicker.test.json';

it('renders correctly', () => {
  const tree = shallow(<Kicker nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
