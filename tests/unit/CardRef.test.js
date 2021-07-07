import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from 'emotion-theming';
import Card from '../../src/components/Card';
import { theme } from '../../src/theme/docsTheme';

// data for this component
import mockData from './data/CardRef.test.json';

// Since there isn't a proper CardRef component, test that card-ref styling
// is applied appropriately (i.e., only when a Card :url: is not specified)
it('renders correctly without url', () => {
  const tree = mount(
    <ThemeProvider theme={theme}>
      <Card nodeData={mockData} />
    </ThemeProvider>
  ).childAt(0);
  expect(tree).toMatchSnapshot();
});

it('renders correctly with url', () => {
  const tree = mount(
    <ThemeProvider theme={theme}>
      <Card url="testdata.com" nodeData={mockData} />
    </ThemeProvider>
  ).childAt(0);
  expect(tree).toMatchSnapshot();
});
