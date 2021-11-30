import React from 'react';
import { shallow } from 'enzyme';
import CardGroup from '../../src/components/ComponentFactory/CardGroup';

// data for this component
import mockData from './data/CardGroup.test.json';

it('renders correctly', () => {
  const tree = shallow(<CardGroup nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
