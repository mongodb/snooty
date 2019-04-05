import React from 'react';
import { shallow } from 'enzyme';
import Strong from '../../src/components/Strong';

// data for this component
import mockData from './data/Strong.test.json';

it('renders correctly', () => {
  const tree = shallow(<Strong nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
