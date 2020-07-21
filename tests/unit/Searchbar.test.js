import React from 'react';
import { shallow } from 'enzyme';
import Searchbar from '../../src/components/Searchbar';

it('renders correctly without browser', () => {
  const condensedTree = shallow(<Searchbar isExpanded={false} />);
  expect(condensedTree).toMatchSnapshot();
  const expandedTree = shallow(<Searchbar isExpanded />);
  expect(expandedTree).toMatchSnapshot();
});
