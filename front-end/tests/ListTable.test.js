import React from 'react';
import { mount, shallow } from 'enzyme';
import ListTable from '../src/components/ListTable';

import mockData from './data/ListTable.test.json';
import mockDataFixedWidths from './data/ListTableFixedWidths.test.json';

const mountListTable = (data) => mount(<ListTable nodeData={data} />);
const shallowListTable = (data) => shallow(<ListTable nodeData={data} />);

describe('when rendering a list-table directive', () => {
  let wrapper;
  let shallowWrapper;
  const data = mockData;

  beforeAll(() => {
    wrapper = mountListTable(data);
    shallowWrapper = shallowListTable(data);
  });

  it('renders correctly', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('displays one header row', () => {
    expect(wrapper.find('thead').children().find('tr')).toHaveLength(1);
  });

  it('displays six header columns', () => {
    expect(wrapper.find('thead').children().find('tr').children().find('th')).toHaveLength(6);
  });

  it('displays five body rows', () => {
    expect(wrapper.find('tbody').children().find('tr')).toHaveLength(5);
  });

  it('displays six body columns', () => {
    expect(wrapper.find('tbody').children().find('tr').first().children().find('td')).toHaveLength(6);
  });

  it('applies the class passed in as an option', () => {
    expect(wrapper.find('.guide-tablenate')).toHaveLength(1);
  });

  it('applies a class based on the widths property', () => {
    expect(wrapper.find('.colwidths-auto')).toHaveLength(1);
  });

  it('renders one stub column', () => {
    expect(wrapper.find('.stub')).toHaveLength(6);
  });
});

describe('when rendering a list table with fixed widths', () => {
  let wrapper;
  let shallowWrapper;
  const data = mockDataFixedWidths;

  beforeAll(() => {
    wrapper = mountListTable(data);
    shallowWrapper = shallowListTable(data);
  });

  it('renders correctly', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('displays no header row', () => {
    expect(wrapper.find('thead').children().find('tr')).toHaveLength(0);
  });

  it('displays one body row', () => {
    expect(wrapper.find('tbody').children().find('tr')).toHaveLength(1);
  });

  it('displays six body columns', () => {
    expect(wrapper.find('tbody').children().find('tr').first().children().find('td')).toHaveLength(6);
  });

  it('applies the class passed in as an option', () => {
    expect(wrapper.find('.guide-tablenate-odd')).toHaveLength(1);
  });

  it('applies a class based on the widths property', () => {
    expect(wrapper.find('.colwidths-given')).toHaveLength(1);
  });

  it('displays a colgroup element', () => {
    expect(wrapper.find('colgroup')).toHaveLength(1);
  });

  it('displays columns with set widths', () => {
    expect(wrapper.find('col')).toHaveLength(2);
    expect(wrapper.find('col[width="20%"]')).toHaveLength(1);
    expect(wrapper.find('col[width="80%"]')).toHaveLength(1);
  });

  it('displays no stub columns', () => {
    expect(wrapper.find('.stub')).toHaveLength(0);
  });
});
