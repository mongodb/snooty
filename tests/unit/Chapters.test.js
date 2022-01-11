import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockData from './data/Chapters.test.json';
import Chapters from '../../src/components/Chapters/Chapters';
import { tick } from '../utils';
import { SidenavContext } from '../../src/components/Sidenav';
import { theme } from '../../src/theme/docsTheme';
import { getPlaintext } from '../../src/utils/get-plaintext';

const mountChapters = () => {
  const { nodeData, metadata } = mockData;
  return render(
    <ThemeProvider theme={theme}>
      <SidenavContext.Provider value={{ isCollapsed: false }}>
        <Chapters nodeData={nodeData} metadata={metadata} />
      </SidenavContext.Provider>
    </ThemeProvider>
  );
};

describe('Chapters', () => {
  jest.useFakeTimers();

  it('renders chapters', () => {
    const wrapper = mountChapters();
    // screen.debug()

    // We expect 2 chapter entries and 1 chapter view selector, per test data.
    expect(wrapper.queryAllByText('Chapter', { exact: false })).toHaveLength(3);
  });

  it('renders guides in gallery view', async () => {
    const wrapper = mountChapters();
    const galleryView = wrapper.getByText('Gallery', { exact: false });

    userEvent.click(galleryView);
    await tick();

    // Only the Chapter view selector should be rendered.
    expect(wrapper.queryAllByText('Chapter', { exact: false })).toHaveLength(1);
    // screen.debug()

    // Three cards should render with Atlas chapter icons, per test data.
    const cardImages = wrapper.queryAllByAltText('Atlas chapter icon');
    expect(cardImages).toHaveLength(3);

    // Make sure that the data passed to a card is correct
    const data = mockData.metadata.guides['cloud/account'];
    expect(wrapper.getByText(getPlaintext(data.title))).toBeTruthy();
    expect(wrapper.getByText('15 mins')).toHaveProperty('href', 'http://localhost/cloud/account/');
  });
});
