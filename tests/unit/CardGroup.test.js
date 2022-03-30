import React from 'react';
import { render } from '@testing-library/react';
import CardGroup from '../../src/components/CardGroup';
import { theme } from '../../src/theme/docsTheme';
import { ThemeProvider } from '@emotion/react';
// data for this component
import mockData from './data/CardGroup.test.json';

it('renders correctly', () => {
  const tree = render(
    <ThemeProvider theme={theme}>
      <CardGroup nodeData={mockData} />
    </ThemeProvider>
  );
  expect(tree.asFragment()).toMatchSnapshot();
});
