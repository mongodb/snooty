import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import CardGroup from '../../src/components/CardGroup';
import { theme } from '../../src/theme/docsTheme';

// data for this component
import mockData from './data/CardRef.test.json';

// Since there isn't a proper CardRef component, test that card-ref styling
// is applied appropriately (i.e., only when a Card :url: is not specified)
it('card correctly with and without url', () => {
  const tree = render(
    <ThemeProvider theme={theme}>
      <CardGroup nodeData={mockData} />
    </ThemeProvider>
  );
  expect(tree.asFragment()).toMatchSnapshot();
});
