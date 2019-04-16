import React from 'react';
import { shallow } from 'enzyme';
import TitleReference from '../../src/components/TitleReference';

// data for this component
import mockData from './data/TitleReference.test.json';

it('renders correctly', () => {
  const tree = shallow(<TitleReference nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
