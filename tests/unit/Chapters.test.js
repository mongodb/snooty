import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockLocation } from '../utils/mock-location';
import Chapters from '../../src/components/Chapters';
import { tick } from '../utils';
import { SidenavContext } from '../../src/components/Sidenav';
import { theme } from '../../src/theme/docsTheme';
import * as useActiveHeading from '../../src/hooks/useActiveHeading';
import { getPlaintext } from '../../src/utils/get-plaintext';
import mockData from './data/Chapters.test.json';

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

beforeAll(() => {
  mockLocation(null, `/`);
});

describe('Chapters', () => {
  jest.useFakeTimers();

  beforeAll(() => {
    jest.spyOn(useActiveHeading, 'default').mockImplementation(() => 'atlas');
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders chapters', () => {
    const wrapper = mountChapters();

    // We expect 2 chapter entries, 1 chapter view selector, and the Chapters ContentsList per test data.
    expect(wrapper.queryAllByText('Chapter', { exact: false })).toHaveLength(5);
  });

  it('renders guides in gallery view', async () => {
    const wrapper = mountChapters();
    const galleryView = wrapper.getByText('Gallery', { exact: false });

    userEvent.click(galleryView);
    await tick();

    // Only the Chapter view selector should be rendered.
    expect(wrapper.queryAllByText('Chapter', { exact: false })).toHaveLength(1);

    // Three cards should render with Atlas chapter icons, per test data.
    const cardImages = wrapper.queryAllByAltText('Atlas chapter icon');
    expect(cardImages).toHaveLength(3);

    // Make sure that the data passed to a card is correct
    const data = mockData.metadata.guides['cloud/account'];
    expect(wrapper.getByText(getPlaintext(data.title))).toBeTruthy();
    expect(wrapper.getByText('15 mins')).toHaveProperty('href', 'http://localhost/cloud/account/');
  });
});
