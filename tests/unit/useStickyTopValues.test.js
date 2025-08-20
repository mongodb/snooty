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

const TestComponent = ({ hasBanner, HelperComponent }) => {
  return (
    <HeaderContext.Provider value={{ hasBanner }}>
      <HelperComponent />
    </HeaderContext.Provider>
  );
};

describe('useStickyTopValues()', () => {
  it('provides the correct top values without any banner content and eol false', () => {
    const wrapper = render(<TestComponent hasBanner={false} HelperComponent={HelperComponent} />);
    expect(wrapper.queryAllByText('60px').length).toBeGreaterThan(0);
  });

  it('provides the correct top values without any banner content and eol true', () => {
    const wrapper = render(<TestComponent hasBanner={false} HelperComponent={HelperComponentEol} />);
    expect(wrapper.queryAllByText('0px').length).toBeGreaterThan(0);
  });
});
