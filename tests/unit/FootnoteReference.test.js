import React from 'react';
import { shallow } from 'enzyme';
import FootnoteReference from '../../src/components/FootnoteReference';

// data for this component
import mockData from './data/FootnoteReference.test.json';

it('renders correctly', () => {
  const tree = shallow(<FootnoteReference nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
