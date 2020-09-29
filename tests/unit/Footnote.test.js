import React from 'react';
import { shallow } from 'enzyme';
import Footnote from '../../src/components/Footnote';

// data for this component
import mockData from './data/Footnote.test.json';

it('renders correctly', () => {
  const tree = shallow(<Footnote nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
