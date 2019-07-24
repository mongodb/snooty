import React from 'react';
import { shallow } from 'enzyme';
import Navbar from '../../src/components/Navbar';

it('renders correctly without browser', () => {
  const tree = shallow(<Navbar />);
  expect(tree).toMatchSnapshot();
});