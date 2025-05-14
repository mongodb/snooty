import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { navigate } from 'gatsby';
import { mockLocation } from '../utils/mock-location';
import Card from '../../src/components/Card';
import { theme } from '../../src/theme/docsTheme';

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

beforeAll(() => {
  mockLocation(null, `/`);
});

describe('relative urls passed to Card', () => {
  test.each([
    ['/foo', 1],
    ['/foo/', 2],
    ['foo', 3],
  ])('should use Gatsby navigate function to render a link to %s', (url, expected) => {
    mockData['options']['url'] = url;
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <Card nodeData={mockData} isCompact={true} />
      </ThemeProvider>
    );
    getByText('Test card headline').click();
    expect(navigate).toHaveBeenCalledTimes(expected);
  });
});
