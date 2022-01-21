import React, { useState } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../../src/components/Searchbar/Pagination';

// Simple wrapper to add state control around the Pagination component
const PaginationController = ({ startPage, totalPages }) => {
  const [page, setPage] = useState(startPage);
  return <Pagination currentPage={page} totalPages={totalPages} setCurrentPage={setPage} />;
};

describe('Pagination', () => {
  it('renders pagination correctly', () => {
    const wrapper = render(<Pagination currentPage={1} totalPages={10} setCurrentPage={jest.fn} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should not allow page 1 to be decremented', () => {
    const wrapper = render(<Pagination currentPage={1} totalPages={10} setCurrentPage={jest.fn} />);
    let paginationText = wrapper.getByText('1/10');
    expect(paginationText).toBeTruthy();
    const decrementButton = wrapper.getByTitle('Back Page');
    expect(decrementButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('should allow pages > 1 to be decremented', () => {
    const wrapper = render(<PaginationController startPage={2} totalPages={5} />);
    let paginationText = wrapper.getByText('2/5');
    expect(paginationText).toBeTruthy();
    const decrementButton = wrapper.getByTitle('Back Page');
    expect(decrementButton).toHaveAttribute('aria-disabled', 'false');
    userEvent.click(decrementButton);
    paginationText = wrapper.getByText('1/5');
    expect(paginationText).toBeTruthy();
  });

  it('should allow pages < total pages to be incremented', () => {
    const wrapper = render(<PaginationController startPage={2} totalPages={5} />);
    let paginationText = wrapper.getByText('2/5');
    expect(paginationText).toBeTruthy();
    const incrementButton = wrapper.getByTitle('Forward Page');
    expect(incrementButton).toHaveAttribute('aria-disabled', 'false');
    userEvent.click(incrementButton);
    paginationText = wrapper.getByText('3/5');
    expect(paginationText).toBeTruthy();
  });

  it('should not allow the last page to be incremented', () => {
    const wrapper = render(<PaginationController startPage={5} totalPages={5} />);
    let paginationText = wrapper.getByText('5/5');
    expect(paginationText).toBeTruthy();
    const incrementButton = wrapper.getByTitle('Forward Page');
    expect(incrementButton).toHaveAttribute('aria-disabled', 'true');
  });
});
