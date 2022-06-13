import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import Card from '../../src/components/Card';
import { theme } from '../../src/theme/docsTheme';
import { navigate } from 'gatsby';

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

it('uses Gatsby navigate function when given a relative URL', () => {
  mockData['options']['url'] = '/foo';
  const { getByText } = render(
    <ThemeProvider theme={theme}>
      <Card nodeData={mockData} isCompact={true} />
    </ThemeProvider>
  );
  getByText('Test card headline').click();
  expect(navigate).toHaveBeenCalledTimes(1);
});
