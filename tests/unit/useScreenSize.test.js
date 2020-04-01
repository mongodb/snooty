import React from 'react';
import { mount } from 'enzyme';
import useScreenSize from '../../src/hooks/useScreenSize';
import { withScreenSize } from '../utils';

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
