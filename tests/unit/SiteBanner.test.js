import React from 'react';
import { render } from '@testing-library/react';
import * as Gatsby from 'gatsby';
import * as RealmUtil from '../../src/utils/realm';
import SiteBanner from '../../src/components/Banner/SiteBanner';
import { HeaderContext } from '../../src/components/Header/header-context';
import { tick } from '../utils';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
const mockSnootyEnv = (snootyEnv) => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata: {
        snootyEnv,
      },
    },
  }));
};

const mockBannerContent = {
  altText: 'Test',
  imgPath: '/banners/test.png',
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
    jest.spyOn(RealmUtil, 'fetchBanner').mockImplementation(() => mockBannerContent);
    const setBannerContent = jest.fn();
    const wrapper = render(
      <HeaderContext.Provider value={{ bannerContent: mockBannerContent, setBannerContent: setBannerContent }}>
        <SiteBanner />
      </HeaderContext.Provider>
    );
    await tick();
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
