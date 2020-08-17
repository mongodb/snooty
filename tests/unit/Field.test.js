import React from 'react';
import { shallow } from 'enzyme';
import Field from '../../src/components/Field';

// data for this component
import mockData from './data/FieldList.test.json';

it('renders correctly', () => {
  const tree = shallow(<Field nodeData={mockData.children[0]} />);
  expect(tree).toMatchSnapshot();
});
