import React from 'react';
import { shallow } from 'enzyme';
import Section from '../../src/components/ComponentFactory/Section';

// data for this component
import mockData from './data/Section.test.json';

it('renders correctly', () => {
  const tree = shallow(<Section nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
