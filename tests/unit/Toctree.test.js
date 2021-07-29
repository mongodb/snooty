import React from 'react';
import { mount } from 'enzyme';
import Toctree from '../../src/components/Toctree';
import mockData from './data/Toctree.test.json';
import { tick } from '../utils';

// mockData is a minimal toctree, based off of Realm's toctree:
// /get-started (drawer)
//   /get-started/introduction-mobile
//   /get-started/introduction-backend
// /sdk
//   /sdk/android
//     /sdk/android/fundamentals (drawer)
//       /sdk/android/fundamentals/async-api
//   /sdk/ios

const mountToctree = (slug) => {
  return mount(<Toctree slug={slug} toctree={mockData?.toctree} />);
};

describe('Toctree', () => {
  jest.useFakeTimers();

  it('renders parent nodes', () => {
    const wrapper = mountToctree('/');
    expect(wrapper.children()).toHaveLength(2);
  });

  it('clicking on a drawer shows nested children', async () => {
    const wrapper = mountToctree('/');
    const parentDrawer = wrapper.childAt(0);

    expect(parentDrawer.find('button')).toHaveLength(1);
    parentDrawer.find('button').simulate('click');
    await tick({ wrapper });

    expect(parentDrawer.prop('level')).toBe(1);
    expect(wrapper.childAt(0).findWhere((n) => n.is('TOCNode') && n.prop('level') === 2)).toHaveLength(2);
  });

  it('correct item set as active based off current page', () => {
    const testActivePage = (testPage, expectedLevel) => {
      const wrapper = mountToctree(testPage);
      let activeItem = wrapper.findWhere((n) => n.is('SideNavItem') && n.prop('active') === true);
      expect(activeItem).toHaveLength(1);
      expect(activeItem.prop('to')).toEqual(testPage);
      expect(activeItem.parents().at(1).prop('level')).toEqual(expectedLevel);
    };

    testActivePage('sdk/android/fundamentals/async-api', 4);
    testActivePage('sdk/ios', 2);
  });
});
