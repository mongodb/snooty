import React from 'react';
import { mount, render } from 'enzyme';
import ListTable from '../../src/components/ListTable';

import mockData from './data/ListTable.test.json';
import mockDataFixedWidths from './data/ListTableFixedWidths.test.json';

const mountListTable = data => mount(<ListTable nodeData={data} />);
const renderListTable = data => render(<ListTable nodeData={data} />);

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
    expect(
      wrapper
        .find('thead')
        .children()
        .find('tr')
    ).toHaveLength(1);
  });

  it('displays six header columns', () => {
    expect(
      wrapper
        .find('thead')
        .children()
        .find('tr')
        .children()
        .find('th')
    ).toHaveLength(6);
  });

  it('displays five body rows', () => {
    expect(
      wrapper
        .find('tbody')
        .children()
        .find('tr')
    ).toHaveLength(5);
  });

  it('displays five body columns', () => {
    expect(
      wrapper
        .find('tbody')
        .children()
        .find('tr')
        .first()
        .children()
        .find('td')
    ).toHaveLength(5);
  });

  it('displays one stub column', () => {
    expect(
      wrapper
        .find('tbody')
        .children()
        .find('tr')
        .first()
        .children()
        .find('th')
    ).toHaveLength(1);
  });

  it('renders one stub column in the body', () => {
    expect(
      wrapper
        .find('th')
        .parent()
        .filterWhere(p => p.is('Cell'))
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

  it('displays no header row', () => {
    expect(
      wrapper
        .find('thead')
        .children()
        .find('tr')
    ).toHaveLength(0);
  });

  it('displays one body row', () => {
    expect(
      wrapper
        .find('tbody')
        .children()
        .find('Row')
    ).toHaveLength(1);
  });

  it('displays six body columns', () => {
    expect(
      wrapper
        .find('tbody')
        .children()
        .find('tr')
        .first()
        .children()
        .find('td')
    ).toHaveLength(6);
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
