import React from 'react';
import { shallow } from 'enzyme';
import Toctree from '../../src/components/Toctree';
import mockData from './data/Toctree.test.json';

// mockData is a minimal toctree, based off of Realm's toctree:
// /get-started (drawer)
//   /get-started/introduction-mobile
//   /get-started/introduction-backend
// /sdk
//   /sdk/android
//     /sdk/android/fundamentals (drawer)
//       /sdk/android/fundamentals/async-api
//   /sdk/ios

const shallowToctree = (slug) => {
  return shallow(<Toctree slug={slug} toctree={mockData?.toctree} />);
};

describe('Toctree', () => {
  it('renders', () => {
    const wrapper = shallowToctree('/');
    expect(wrapper).toMatchSnapshot();
  });

  it('correctly assigns the active SideNavItem', () => {
    const checkForActiveSideNavItem = (wrapper) =>
      wrapper.findWhere((n) => n.name() === 'SideNavItem' && n.prop('active') === true);

    let testSlug = 'sdk/android/fundamentals/async-api';
    let wrapper = shallowToctree(`/${testSlug}/`);
    let activeSideNavItem = checkForActiveSideNavItem(wrapper);
    expect(activeSideNavItem).toHaveLength(1);
    expect(activeSideNavItem.prop('to')).toEqual(testSlug);

    testSlug = 'get-started/introduction-backend';
    wrapper = shallowToctree(testSlug);
    activeSideNavItem = checkForActiveSideNavItem(wrapper);
    expect(activeSideNavItem).toHaveLength(1);
    expect(activeSideNavItem.prop('to')).toEqual(testSlug);
  });
});
