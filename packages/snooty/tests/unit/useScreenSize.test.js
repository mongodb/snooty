import React from 'react';
import { render } from '@testing-library/react';
import useScreenSize from '../../src/hooks/useScreenSize';
import { setDesktop, setMobile, setTablet } from '../utils';

const Test = () => {
  const { isTabletOrMobile, isMobile } = useScreenSize();
  return (
    <>
      {isTabletOrMobile && <div id="isTabletOrMobile"> isTabletOrMobile </div>}
      {isMobile && <div id="isMobile"> isMobile </div>}
      <div id="window-innerWidth">{window.innerWidth}</div>
      <div id="window-innerHeight">{window.innerHeight} </div>
    </>
  );
};

describe('useScreenSize()', () => {
  it('returns the correct data for large screens', async () => {
    setDesktop();
    const wrapper = render(<Test />);

    expect(wrapper.queryByText('isTabletOrMobile')).not.toBeTruthy();
    expect(wrapper.queryByText('isMobile')).not.toBeTruthy();
  });

  it('returns the correct data for medium/tablet screens', () => {
    setTablet();
    const wrapper = render(<Test />);

    expect(wrapper.queryByText('isTabletOrMobile')).toBeTruthy();
    expect(wrapper.queryByText('isMobile')).not.toBeTruthy();
  });

  it('returns the correct data for small/mobile screens', () => {
    setMobile();
    const wrapper = render(<Test />);

    expect(wrapper.queryByText('isTabletOrMobile')).toBeTruthy();
    expect(wrapper.queryByText('isMobile')).toBeTruthy();
  });
});
