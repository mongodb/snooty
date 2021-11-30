import React from 'react';
import { mount, render } from 'enzyme';
import ListTable from '../../src/components/ComponentFactory/ListTable';
import { matchers } from 'jest-emotion';

import mockData from './data/ListTable.test.json';
import mockDataFixedWidths from './data/ListTableFixedWidths.test.json';

expect.extend(matchers);

const mountListTable = (data) => mount(<ListTable nodeData={data} />);
const renderListTable = (data) => render(<ListTable nodeData={data} />);

describe('when rendering a list-table directive', () => {
  let wrapper;
  let rendered;
  const data = mockData;

  beforeAll(() => {
    wrapper = mountListTable(data);
    rendered = renderListTable(data);
  });

  it('renders correctly', () => {
    expect(rendered).toMatchSnapshot();
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

  it('displays five body columns', () => {
    expect(wrapper.find('tbody').children().find('tr').first().children().find('td')).toHaveLength(5);
  });

  it('displays one stub column', () => {
    expect(wrapper.find('tbody').children().find('tr').first().children().find('th')).toHaveLength(1);
  });

  it('renders one stub column in the body', () => {
    expect(
      wrapper
        .find('th')
        .parent()
        .filterWhere((p) => p.is('Cell'))
    ).toHaveLength(5);
  });
});

describe('when rendering a list table with fixed widths', () => {
  let wrapper;
  let rendered;
  const data = mockDataFixedWidths;

  beforeAll(() => {
    wrapper = mountListTable(data);
    rendered = renderListTable(data);
  });

  it('renders correctly', () => {
    expect(rendered).toMatchSnapshot();
  });

  it('displays no content in the header row', () => {
    expect(wrapper.find('thead').children().find('tr').text()).toEqual('');
  });

  it('displays one body row', () => {
    expect(wrapper.find('tbody').children().find('Row')).toHaveLength(1);
  });

  it('displays six body columns', () => {
    expect(wrapper.find('tbody').children().find('tr').first().children().find('td')).toHaveLength(6);
  });

  it('displays columns with set widths', () => {
    const headers = wrapper.find('TableHeader');
    expect(headers).toHaveLength(6);
    expect(headers.at(0)).toHaveStyleRule('width', '5%');
    expect(headers.at(1)).toHaveStyleRule('width', '10%');
    expect(headers.at(2)).toHaveStyleRule('width', '15%');
    expect(headers.at(3)).toHaveStyleRule('width', '20%');
    expect(headers.at(4)).toHaveStyleRule('width', '30%');
    expect(headers.at(5)).toHaveStyleRule('width', '20%');
  });

  it('displays no stub columns', () => {
    expect(wrapper.find('.stub')).toHaveLength(0);
  });
});
