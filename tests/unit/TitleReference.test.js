import React from 'react';
import { shallow } from 'enzyme';
import TitleReference from '../../src/components/ComponentFactory/TitleReference';

// data for this component
import mockData from './data/TitleReference.test.json';

it('renders correctly', () => {
  const tree = shallow(<TitleReference nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
