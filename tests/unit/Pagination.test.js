import React from 'react';
import { shallow } from 'enzyme';
import Pagination from '../../src/components/Searchbar/Pagination';

it('renders pagination correctly', () => {
  const tree = shallow(<Pagination currentPage={1} totalPages={10} />);
  expect(tree).toMatchSnapshot();
});
