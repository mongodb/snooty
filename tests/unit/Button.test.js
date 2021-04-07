import React from 'react';
import { shallow } from 'enzyme';
import Button from '../../src/components/landing/Button';

// data for this component
import mockData from './data/landing/Button.test.json';

it('renders correctly', () => {
  const tree = shallow(<Button nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
