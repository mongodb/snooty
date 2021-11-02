import React from 'react';
import useStickyTopValues from '../../src/hooks/useStickyTopValues';
import { HeaderContext } from '../../src/components/header-context';
import { mount } from 'enzyme';

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
    const wrapper = mount(<TestComponent mockBannerContent={null} />);
    expect(wrapper.find('div.topLarge').text()).toEqual('88px');
    expect(wrapper.find('div.topMedium').text()).toEqual('56px');
    expect(wrapper.find('div.topSmall').text()).toEqual('108px');
  });

  it('provides the correct top values with banner content', () => {
    const wrapper = mount(<TestComponent mockBannerContent={{ isEnabled: true }} />);
    expect(wrapper.find('div.topLarge').text()).toEqual('128px');
    expect(wrapper.find('div.topMedium').text()).toEqual('96px');
    expect(wrapper.find('div.topSmall').text()).toEqual('148px');
  });
});
