import React from 'react';
import { shallow } from 'enzyme';
import Heading from '../src/components/Heading';

// data for this component
import mockData from './data/Heading.test.json';

it('renders correctly', () => {
  const tree = shallow(<Heading nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
