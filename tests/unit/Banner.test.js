import React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { Stitch } from 'mongodb-stitch-browser-sdk';
import Banner from '../../src/components/Banner';

const mockBannerContent = {
  altText: 'Test',
  imgPath: '/banners/test.png',
  mobileImgPath: '/banners/test-mobile.png',
  url: 'https://mongodb.com',
};

const mockStitchClient = {
  auth: {
    loginWithCredential: jest.fn().mockImplementation(() => Promise.resolve()),
  },
  callFunction: jest.fn().mockImplementation(() => Promise.resolve(mockBannerContent)),
};

describe('Banner component', () => {
  it('renders without a banner image', () => {
    const wrapper = mount(<Banner />);
    expect(wrapper.find('Banner').children()).toHaveLength(0);
  });

  it('renders with a banner image', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    jest.spyOn(Stitch, 'hasAppClient').mockImplementation(() => true);
    jest.spyOn(Stitch, 'getAppClient').mockImplementation(() => {
      return mockStitchClient;
    });
    jest.spyOn(Stitch, 'initializeAppClient').mockImplementation(() => {
      return mockStitchClient;
    });

    await act(async () => {
      render(<Banner />, container);
    });

    expect(container).toMatchSnapshot();
  });
});
