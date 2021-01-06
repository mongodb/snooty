import React from 'react';
import { mount } from 'enzyme';
import useScreenSize from '../../src/hooks/useScreenSize';
import { setDesktop, setMobile, setTablet } from '../utils';

const Test = () => {
  const { isTabletOrMobile, isMobile } = useScreenSize();
  return (
    <>
      <div id="isTabletOrMobile" value={isTabletOrMobile} />
      <div id="isMobile" value={isMobile} />
      <div id="window-innerWidth" value={window.innerWidth} />
      <div id="window-innerHeight" value={window.innerHeight} />
    </>
  );
};

describe('useScreenSize()', () => {
  it('returns the correct data for large screens', async () => {
    setDesktop();
    const wrapper = mount(<Test />);

    expect(wrapper.find('#isTabletOrMobile').prop('value')).toEqual(false);
    expect(wrapper.find('#isMobile').prop('value')).toEqual(false);
  });

  it('returns the correct data for medium/tablet screens', () => {
    setTablet();
    const wrapper = mount(<Test />);

    expect(wrapper.find('#isTabletOrMobile').prop('value')).toEqual(true);
    expect(wrapper.find('#isMobile').prop('value')).toEqual(false);
  });

  it('returns the correct data for small/mobile screens', () => {
    setMobile();
    const wrapper = mount(<Test />);

    expect(wrapper.find('#isTabletOrMobile').prop('value')).toEqual(true);
    expect(wrapper.find('#isMobile').prop('value')).toEqual(true);
  });
});
