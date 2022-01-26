import React from 'react';
import { render } from '@testing-library/react';
import FieldList from '../../src/components/FieldList';
import { theme } from '../../src/theme/docsTheme';
import { ThemeProvider } from '@emotion/react';
// data for this component
import mockData from './data/FieldList.test.json';

it('renders correctly', () => {
  const tree = render(
    <ThemeProvider theme={theme}>
      <FieldList nodeData={mockData} />
    </ThemeProvider>
  );
  expect(tree.asFragment()).toMatchSnapshot();
});
