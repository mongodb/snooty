import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from 'emotion-theming';
import Kicker from '../../src/components/landing/Kicker';
import { theme } from '../../src/theme/docsTheme';

// data for this component
import mockData from './data/landing/Kicker.test.json';

it('renders correctly', () => {
  const tree = mount(
    <ThemeProvider theme={theme}>
      <Kicker nodeData={mockData} />
    </ThemeProvider>
  )
    .childAt(0)
    .childAt(0);
  expect(tree).toMatchSnapshot();
});
