import React from 'react';
import { shallow } from 'enzyme';
import Button from '../../src/components/ComponentFactory/Button';

// data for this component
import mockData from './data/Button.test.json';

it('renders correctly', () => {
  const tree = shallow(<Button nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
