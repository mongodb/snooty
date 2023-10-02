import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { mockLocation } from '../utils/mock-location';
import CardGroup from '../../src/components/Card/CardGroup';
import { theme } from '../../src/theme/docsTheme';
// data for this component
import mockData from './data/CardGroup.test.json';

beforeAll(() => {
  mockLocation(null, `/`);
});

it('renders correctly', () => {
  const tree = render(
    <ThemeProvider theme={theme}>
      <CardGroup nodeData={mockData} />
    </ThemeProvider>
  );
  expect(tree.asFragment()).toMatchSnapshot();
});
