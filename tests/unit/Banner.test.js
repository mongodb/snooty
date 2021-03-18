import React from 'react';
import { mount } from 'enzyme';
import { Stitch } from 'mongodb-stitch-browser-sdk';
import Banner from '../../src/components/Banner';
import { HeaderContext } from '../../src/components/header-context';

const mockBannerContent = {
  altText: 'Test',
  imgPath: '/banners/test.png',
  mobileImgPath: '/banners/test-mobile.png',
  url: 'https://mongodb.com',
};

describe('Banner component', () => {
  it('renders without a banner image', () => {
    // bannerContent state should remain null
    const wrapper = mount(<Banner />);
    expect(wrapper.find('Banner').children()).toHaveLength(0);
  });

  it('renders with a banner image', async () => {
    jest.spyOn(Stitch, 'hasAppClient').mockImplementation(() => true);
    jest.spyOn(Stitch, 'getAppClient').mockImplementation();
    jest.spyOn(Stitch, 'initializeAppClient').mockImplementation();

    const wrapper = mount(
      <HeaderContext.Provider value={{ bannerContent: mockBannerContent, setBannerContent: null }}>
        <Banner />
      </HeaderContext.Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
