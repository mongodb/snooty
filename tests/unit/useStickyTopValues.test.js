import React from 'react';
import { render } from '@testing-library/react';
import useStickyTopValues from '../../src/hooks/useStickyTopValues';
import { HeaderContext } from '../../src/components/Header/header-context';

const HelperComponent = () => {
  const { topLarge, topMedium, topSmall } = useStickyTopValues(false);
  return (
    <>
      <div className="topLarge">{topLarge}</div>
      <div className="topMedium">{topMedium}</div>
      <div className="topSmall">{topSmall}</div>
    </>
  );
};

const HelperComponentEol = () => {
  const { topLarge, topMedium, topSmall } = useStickyTopValues(true);
  return (
    <>
      <div className="topLarge">{topLarge}</div>
      <div className="topMedium">{topMedium}</div>
      <div className="topSmall">{topSmall}</div>
    </>
  );
};

const HelperComponentActionBar = () => {
  const { topLarge, topMedium, topSmall } = useStickyTopValues(false, true);
  return (
    <>
      <div className="topLarge">{topLarge}</div>
      <div className="topMedium">{topMedium}</div>
      <div className="topSmall">{topSmall}</div>
    </>
  );
};

const TestComponent = ({ mockBannerContent, HelperComponent }) => {
  return (
    <HeaderContext.Provider value={{ bannerContent: mockBannerContent }}>
      <HelperComponent />
    </HeaderContext.Provider>
  );
};

describe('useStickyTopValues()', () => {
  it('provides the correct top values without any banner content and eol false', () => {
    const wrapper = render(<TestComponent mockBannerContent={null} HelperComponent={HelperComponent} />);
    expect(wrapper.queryByText('95px')).toBeTruthy();
    expect(wrapper.queryByText('56px')).toBeTruthy();
    expect(wrapper.queryByText('108px')).toBeTruthy();
  });

  it('provides the correct top values without any banner content and eol true', () => {
    const wrapper = render(<TestComponent mockBannerContent={null} HelperComponent={HelperComponentEol} />);
    expect(wrapper.queryAllByText('0px')).toBeTruthy();
  });

  it('provides the correct top values with just the action bar', () => {
    const wrapper = render(<TestComponent mockBannerContent={null} HelperComponent={HelperComponentActionBar} />);
    expect(wrapper.queryAllByText('210px')).toBeTruthy();
    expect(wrapper.queryAllByText('241px')).toBeTruthy();
    expect(wrapper.queryAllByText('293px')).toBeTruthy();
    wrapper.debug();
  });
});
