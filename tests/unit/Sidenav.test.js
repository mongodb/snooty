import React from 'react';
import * as Gatsby from 'gatsby';
import { mount } from 'enzyme';
import { SidenavContextProvider } from '../../src/components/sidenav-context';
import Sidenav from '../../src/components/Sidenav';
import SidenavMobileMenuButton from '../../src/components/SidenavMobileMenuButton';
import { theme } from '../../src/theme/docsTheme';
import { tick, setMatchMedia, setMobile } from '../utils';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
const setProject = (project) => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata: {
        project,
      },
    },
  }));
};

const mountSidenav = async () => {
  setProject('test-project');
  const wrapper = mount(
    <SidenavContextProvider>
      <SidenavMobileMenuButton />
      <Sidenav page={{}} slug={''} toctree={{ children: [] }} />
    </SidenavContextProvider>
  );
  await tick({ wrapper });

  return wrapper;
};

const resizeWindowWidth = (width) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
};

const findCollapseButton = (wrapper) => {
  return wrapper.find('button[data-testid="side-nav-collapse-toggle"]');
};

// Used to check for collapsed state since we cannot reach the Sidenav component's
// isCollapsed state.
const expectSidenavCollapsed = (wrapper, value) => {
  const collapseButton = findCollapseButton(wrapper);
  expect(collapseButton.exists('ChevronRight')).toEqual(value);
  expect(collapseButton.exists('ChevronLeft')).toEqual(!value);
};

const expectMobileSidenavHidden = (wrapper, value) => {
  // LG's collapse button should still be in its open state,
  // even though the button itself should not be displayed as none
  expectSidenavCollapsed(wrapper, false);

  const mobileMenuButton = wrapper.find('SidenavMobileMenuButton');
  expect(mobileMenuButton.exists('Menu')).toEqual(value);
  expect(mobileMenuButton.exists('X')).toEqual(!value);
  expect(wrapper.find('SidenavMobileTransition').prop('hideMobile')).toEqual(value);
};

describe('Sidenav', () => {
  jest.useFakeTimers();
  let wrapper;

  it('works on desktop', async () => {
    // Sidenav open by default
    wrapper = await mountSidenav();
    expectSidenavCollapsed(wrapper, false);

    // Close the sidenav
    findCollapseButton(wrapper).simulate('click');
    await tick({ wrapper });
    expectSidenavCollapsed(wrapper, true);
  });

  it('works on tablet', async () => {
    const contentOverlayStr = 'ContentOverlay';
    setMatchMedia(theme.screenSize.tablet);

    // Sidenav collapsed by default
    wrapper = await mountSidenav();
    expectSidenavCollapsed(wrapper, true);
    expect(wrapper.exists(contentOverlayStr)).toEqual(false);

    // Open the sidenav
    findCollapseButton(wrapper).simulate('click');
    await tick({ wrapper });
    expectSidenavCollapsed(wrapper, false);
    expect(wrapper.exists(contentOverlayStr)).toEqual(true);

    // Clicking on the ContentOverlay closes the sidenav
    wrapper.find(contentOverlayStr).simulate('click');
    await tick({ wrapper });
    expectSidenavCollapsed(wrapper, true);
    expect(wrapper.exists(contentOverlayStr)).toEqual(false);
  });

  it('works on mobile', async () => {
    const mobileWidth = 420;
    setMobile();
    resizeWindowWidth(mobileWidth);

    // Sidenav open by default, but is hidden
    wrapper = await mountSidenav();
    expectMobileSidenavHidden(wrapper, true);
    expect(wrapper.find('SideNav').prop('widthOverride')).toEqual(mobileWidth);

    // Clicking menu button displays Sidenav
    let mobileMenuButton = wrapper.find('SidenavMobileMenuButton');
    mobileMenuButton.find('IconButton').simulate('click');
    await tick({ wrapper });
    expectMobileSidenavHidden(wrapper, false);

    // Clicking menu button again closes Sidenav
    mobileMenuButton.find('IconButton').simulate('click');
    await tick({ wrapper });
    expectMobileSidenavHidden(wrapper, true);
  });
});
