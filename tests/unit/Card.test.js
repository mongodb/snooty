import React from 'react';
import { render } from '@testing-library/react';
import Card from '../../src/components/Card';
import { theme } from '../../src/theme/docsTheme';
import { ThemeProvider } from '@emotion/react';
// data for this component
import mockData from './data/Card.test.json';

it('renders correctly', () => {
  const tree = render(
    <ThemeProvider theme={theme}>
      <Card nodeData={mockData} />
    </ThemeProvider>
  );
  expect(tree.asFragment()).toMatchSnapshot();
});
