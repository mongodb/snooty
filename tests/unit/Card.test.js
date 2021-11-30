import React from 'react';
import { shallow } from 'enzyme';
import Card from '../../src/components/ComponentFactory/Card';

// data for this component
import mockData from './data/Card.test.json';

it('renders correctly', () => {
  const tree = shallow(<Card nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
