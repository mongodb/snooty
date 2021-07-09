import React from 'react';
import { shallow } from 'enzyme';
import Procedure from '../../src/components/Procedure';

// data for this component
import mockData from './data/Procedure.test.json';

it('renders correctly', () => {
  const tree = shallow(<Procedure nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
