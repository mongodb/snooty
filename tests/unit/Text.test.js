import React from 'react';
import { shallow } from 'enzyme';
import Text from '../../src/components/ComponentFactory/Text';

// data for this component
import mockData from './data/Text.test.json';

it('renders correctly', () => {
  const tree = shallow(<Text nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
