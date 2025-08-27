import React from 'react';
import { render } from '@testing-library/react';
import * as Gatsby from 'gatsby';
import { palette } from '@leafygreen-ui/palette';
import * as RealmUtil from '../../src/utils/realm';
import SiteBanner from '../../src/components/Banner/SiteBanner';
import { HeaderContext } from '../../src/components/Header/header-context';
import { tick } from '../utils';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
const mockSnootyEnv = (snootyEnv: string) => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata: {
        snootyEnv,
      },
    },
  }));
};

const mockBannerContent = {
  isEnabled: true,
  altText: 'Test',
  imgPath: '/banners/test.png',
  tabletImgPath: '/banners/test-tablet.png',
  mobileImgPath: '/banners/test-mobile.png',
  url: 'https://mongodb.com',
};

describe('Banner component', () => {
  beforeAll(() => {
    mockSnootyEnv('development');
  });

  it('renders without a banner image', () => {
    // bannerContent state should remain null
    const wrapper = render(<SiteBanner />);
    expect(wrapper.queryByAltText(mockBannerContent.altText)).toBeNull();
  });

  it('renders with a banner image', async () => {
    jest.useFakeTimers();
    jest.spyOn(RealmUtil, 'fetchBanner').mockResolvedValueOnce(() => mockBannerContent);
    const wrapper = render(
      <HeaderContext.Provider value={{ hasBanner: true, totalHeaderHeight: '' }}>
        <SiteBanner />
      </HeaderContext.Provider>
    );
    await tick();
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('renders with custom text', async () => {
    jest.useFakeTimers();
    const bannerContent = {
      isEnabled: true,
      altText: mockBannerContent.altText,
      bgColor: palette.green.dark3,
      text: 'This is custom banner text',
      pillText: 'DOP',
      url: mockBannerContent.url,
    };
    jest.spyOn(RealmUtil, 'fetchBanner').mockResolvedValueOnce(() => bannerContent);
    const wrapper = render(
      <HeaderContext.Provider value={{ hasBanner: true, totalHeaderHeight: '' }}>
        <SiteBanner />
      </HeaderContext.Provider>
    );
    await tick();
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
