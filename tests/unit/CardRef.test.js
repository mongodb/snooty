import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from 'emotion-theming';
import CardGroup from '../../src/components/ComponentFactory/CardGroup';
import { theme } from '../../src/theme/docsTheme';

// data for this component
import mockData from './data/CardRef.test.json';

// Since there isn't a proper CardRef component, test that card-ref styling
// is applied appropriately (i.e., only when a Card :url: is not specified)
it('card correctly with and without url', () => {
  const tree = mount(
    <ThemeProvider theme={theme}>
      <CardGroup nodeData={mockData} />
    </ThemeProvider>
  ).childAt(0);
  expect(tree).toMatchSnapshot();
});
