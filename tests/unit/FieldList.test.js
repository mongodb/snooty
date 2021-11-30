import React from 'react';
import { shallow } from 'enzyme';
import FieldList from '../../src/components/ComponentFactory/FieldList';

// data for this component
import mockData from './data/FieldList.test.json';

it('renders correctly', () => {
  const tree = shallow(<FieldList nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
