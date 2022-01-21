import React from 'react';
import useStickyTopValues from '../../src/hooks/useStickyTopValues';
import { HeaderContext } from '../../src/components/header-context';
import { render } from '@testing-library/react';

const HelperComponent = () => {
  const { topLarge, topMedium, topSmall } = useStickyTopValues();
  return (
    <>
      <div className="topLarge">{topLarge}</div>
      <div className="topMedium">{topMedium}</div>
      <div className="topSmall">{topSmall}</div>
    </>
  );
};

const TestComponent = ({ mockBannerContent }) => {
  return (
    <HeaderContext.Provider value={{ bannerContent: mockBannerContent }}>
      <HelperComponent />
    </HeaderContext.Provider>
  );
};

describe('useStickyTopValues()', () => {
  it('provides the correct top values without any banner content', () => {
    const wrapper = render(<TestComponent mockBannerContent={null} />);
    expect(wrapper.queryByText('88px')).toBeTruthy();
    expect(wrapper.queryByText('56px')).toBeTruthy();
    expect(wrapper.queryByText('108px')).toBeTruthy();
  });

  it('provides the correct top values with banner content', () => {
    const wrapper = render(<TestComponent mockBannerContent={{ isEnabled: true }} />);
    expect(wrapper.queryByText('128px')).toBeTruthy();
    expect(wrapper.queryByText('96px')).toBeTruthy();
    expect(wrapper.queryByText('148px')).toBeTruthy();
  });
});
