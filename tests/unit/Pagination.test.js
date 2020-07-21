import React, { useState } from 'react';
import { shallow, mount } from 'enzyme';
import Pagination from '../../src/components/Searchbar/Pagination';

// Simple wrapper to add state control around the Pagination component
const PaginationController = ({ startPage, totalPages }) => {
  const [page, setPage] = useState(startPage);
  return <Pagination currentPage={page} totalPages={totalPages} setCurrentPage={setPage} />;
};

describe('Pagination', () => {
  it('renders pagination correctly', () => {
    const wrapper = shallow(<Pagination currentPage={1} totalPages={10} setCurrentPage={jest.fn} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not allow page 1 to be decremented', () => {
    const wrapper = shallow(<Pagination currentPage={1} totalPages={10} setCurrentPage={jest.fn} />);
    let paginationText = wrapper.find('PaginationText').text();
    expect(paginationText).toBe('1/10');
    const decrementButton = wrapper.find('PaginationButton').at(0);
    expect(decrementButton.props().disabled).toBeTruthy();
    decrementButton.simulate('click');
    paginationText = wrapper.find('PaginationText').text();
    // Should not allow for 1 to be decremented
    expect(paginationText).toBe('1/10');
  });

  it('should allow pages > 1 to be decremented', () => {
    const paginationWithController = mount(<PaginationController startPage={2} totalPages={5} />);
    let paginationText = paginationWithController.find('PaginationText').text();
    expect(paginationText).toBe('2/5');
    const decrementButton = paginationWithController.find('PaginationButton').at(0);
    expect(decrementButton.props().disabled).toBeFalsy();
    decrementButton.simulate('click');
    paginationText = paginationWithController.find('PaginationText').text();
    expect(paginationText).toBe('1/5');
  });

  it('should allow pages < total pages to be incremented', () => {
    const paginationWithController = mount(<PaginationController startPage={2} totalPages={5} />);
    let paginationText = paginationWithController.find('PaginationText').text();
    expect(paginationText).toBe('2/5');
    const incrementButton = paginationWithController.find('PaginationButton').at(1);
    expect(incrementButton.props().disabled).toBeFalsy();
    incrementButton.simulate('click');
    paginationText = paginationWithController.find('PaginationText').text();
    expect(paginationText).toBe('3/5');
  });

  it('should not allow the last page to be incremented', () => {
    const paginationWithController = mount(<PaginationController startPage={5} totalPages={5} />);
    let paginationText = paginationWithController.find('PaginationText').text();
    expect(paginationText).toBe('5/5');
    const incrementButton = paginationWithController.find('PaginationButton').at(1);
    expect(incrementButton.props().disabled).toBeTruthy();
    incrementButton.simulate('click');
    paginationText = paginationWithController.find('PaginationText').text();
    expect(paginationText).toBe('5/5');
  });
});
