import React from 'react';
import { render } from '@testing-library/react';
import ListTable from '../../src/components/ListTable';
import { matchers } from 'jest-emotion';

import mockData from './data/ListTable.test.json';
import mockDataFixedWidths from './data/ListTableFixedWidths.test.json';

expect.extend(matchers);

const mountListTable = (data) => render(<ListTable nodeData={data} />);

describe('when rendering a list-table directive', () => {
  const data = mockData;

  it('renders correctly', () => {
    const wrapper = mountListTable(data);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('displays one header row', () => {
    const wrapper = mountListTable(data);
    expect(wrapper.getByTestId('leafygreen-ui-header-row')).toBeTruthy();
  });

  it('displays six header columns', () => {
    const wrapper = mountListTable(data);
    expect(wrapper.queryAllByRole('columnheader')).toHaveLength(6);
  });

  it('displays five body rows', () => {
    const wrapper = mountListTable(data);
    // we test for 6 here, with an offset to account for the header row
    expect(wrapper.queryAllByRole('row')).toHaveLength(6);
  });

  it('renders one stub column per row', () => {
    const wrapper = mountListTable(data);
    expect(wrapper.queryAllByRole('rowheader')).toHaveLength(5);
  });
});

describe('when rendering a list table with fixed widths', () => {
  const data = mockDataFixedWidths;

  it('renders correctly', () => {
    const wrapper = mountListTable(data);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('displays six header columns', () => {
    const wrapper = mountListTable(data);
    expect(wrapper.queryAllByRole('columnheader')).toHaveLength(6);
  });

  it('displays no content in the header row', () => {
    const wrapper = mountListTable(data);
    expect(wrapper.getByTestId('leafygreen-ui-header-row')).toBeTruthy();
    expect(wrapper.queryByText('name')).not.toBeTruthy();
  });

  it('displays no stub columns', () => {
    const wrapper = mountListTable(data);
    expect(wrapper.queryAllByRole('rowheader')).toHaveLength(0);
  });
});
