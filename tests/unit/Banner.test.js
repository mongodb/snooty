import React from 'react';
import { mount } from 'enzyme';
import * as StitchUtil from '../../src/utils/stitch';
import Banner from '../../src/components/Banner';
import { HeaderContext } from '../../src/components/header-context';

const mockBannerContent = {
  altText: 'Test',
  imgPath: '/banners/test.png',
  mobileImgPath: '/banners/test-mobile.png',
  url: 'https://mongodb.com',
};

const mockClient = {
  auth: {
    loginWithCredential: jest.fn(() => {
      return new Promise((resolve) => resolve());
    }),
  },
  callFunction: jest.fn(() => Promise.resolve(mockBannerContent)),
};

describe('Banner component', () => {
  it('renders without a banner image', () => {
    // bannerContent state should remain null
    const wrapper = mount(<Banner />);
    expect(wrapper.find('Banner').children()).toHaveLength(0);
  });

  it('renders with a banner image', async () => {
    jest.spyOn(StitchUtil, 'getStitchClient').mockImplementation(() => mockClient);
    const setBannerContent = jest.fn();

    const wrapper = mount(
      <HeaderContext.Provider value={{ bannerContent: mockBannerContent, setBannerContent: setBannerContent }}>
        <Banner />
      </HeaderContext.Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
