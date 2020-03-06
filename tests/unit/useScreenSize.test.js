import React from 'react';
import { mount } from 'enzyme';
import { Context as ResponsiveContext } from 'react-responsive';
import useScreenSize from '../../src/hooks/useScreenSize';

export function withScreenSize(size) {
  const screenSizes = {
    // Simulate a 1920px x 1080px desktop monitor
    desktop: { width: 1920, height: 1080 },
    // Simulate a 10.5" iPad Pro (1668px x 2224px @ 2x scale)
    'ipad-pro': { width: 834, height: 1112 },
    // Simulate an iPhone X (1125px x 2436px @ 3x scale)
    'iphone-x': { width: 375, height: 812 },
  };
  return {
    wrappingComponent: ResponsiveContext.Provider,
    wrappingComponentProps: { value: screenSizes[size] },
  };
}

const Test = () => {
  const { isTabletOrMobile, isSmallScreen } = useScreenSize();
  return (
    <>
      <div id="isTabletOrMobile" value={isTabletOrMobile} />
      <div id="isSmallScreen" value={isSmallScreen} />
      <div id="window-innerWidth" value={window.innerWidth} />
      <div id="window-innerHeight" value={window.innerHeight} />
    </>
  );
};

describe('useScreenSize()', () => {
  it('returns the correct data for large screens', () => {
    const wrapper = mount(<Test />, withScreenSize('desktop'));

    expect(wrapper.find('#isTabletOrMobile').prop('value')).toEqual(false);
    expect(wrapper.find('#isSmallScreen').prop('value')).toEqual(false);
  });

  it('returns the correct data for medium/tablet screens', () => {
    const wrapper = mount(<Test />, withScreenSize('ipad-pro'));

    expect(wrapper.find('#isTabletOrMobile').prop('value')).toEqual(true);
    expect(wrapper.find('#isSmallScreen').prop('value')).toEqual(false);
  });

  it('returns the correct data for small/mobile screens', () => {
    const wrapper = mount(<Test />, withScreenSize('iphone-x'));

    expect(wrapper.find('#isTabletOrMobile').prop('value')).toEqual(true);
    expect(wrapper.find('#isSmallScreen').prop('value')).toEqual(true);
  });
});
