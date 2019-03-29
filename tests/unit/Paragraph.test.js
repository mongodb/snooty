import React from 'react';
import { shallow } from 'enzyme';
import Paragraph from '../../src/components/Paragraph';

// data for this component
import mockData from './data/Paragraph.test.json';

it('renders correctly', () => {
  const tree = shallow(<Paragraph nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
