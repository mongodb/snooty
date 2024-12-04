import React, { useState } from 'react';
import Icon from '@leafygreen-ui/icon';
import { SideNav, SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import { css, Global } from '@emotion/react';
import useScreenSize from '../../hooks/useScreenSize';

// Prevent content scrolling when the side nav is open on mobile and tablet screen sizes
const disableScroll = (shouldDisableScroll) => css`
  body {
    ${shouldDisableScroll && 'overflow: hidden;'}
  }
`;

export function UnifiedSidenav() {
  const { isTablet } = useScreenSize();
  const [isCollapsed, setCollapsed] = useState(isTablet);
  // Hide the Sidenav with css while keeping state as open/not collapsed.
  // This prevents LG's SideNav component from being seen in its collapsed state on mobile
  const [hideMobile, setHideMobile] = useState(true);
  return (
    <>
      <Global
        styles={css`
          ${disableScroll(!hideMobile)}
        `}
      />

      <SideNav
        widthOverride={300}
        className={css`
          height: 100vh; // sets height of SideNav
        `}
      >
        <SideNavItem>Overview</SideNavItem>
        <SideNavItem>Introduction</SideNavItem>
        <SideNavItem>
          Android SDK
          <SideNavItem>Install MongoDB Community Edition</SideNavItem>
          <SideNavGroup header="Fundamentals" collapsible glyph={<Icon glyph="Building" />}>
            <SideNavItem active>Upgrade MongoDB Community to MongoDB Enterprise</SideNavItem>
            <SideNavItem>Verify Integrity of MongoDB Packages</SideNavItem>
            <SideNavGroup header="Preferences">
              <SideNavItem>Privacy</SideNavItem>
              <SideNavItem>Security</SideNavItem>
              <SideNavItem>New Link</SideNavItem>
            </SideNavGroup>
          </SideNavGroup>
        </SideNavItem>
      </SideNav>
    </>
  );
}
