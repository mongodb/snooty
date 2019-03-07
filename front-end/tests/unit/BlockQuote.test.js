import React from 'react';
import { shallow } from 'enzyme';
import BlockQuote from '../../src/components/BlockQuote';

// data for this component
import mockData from './data/BlockQuote.test.json';

it('renders correctly', () => {
  const tree = shallow(<BlockQuote nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});
