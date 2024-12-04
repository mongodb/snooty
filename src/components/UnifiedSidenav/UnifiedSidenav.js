import React from 'react';

import { SideNav, SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import { css, Global } from '@emotion/react';
import { cx } from '@leafygreen-ui/emotion';

import { sideNavItemTOCStyling } from '../Sidenav/styles/sideNavItem';
import { useUnifiedToc } from '../../hooks/use-unified-toc';

// Prevent content scrolling when the side nav is open on mobile and tablet screen sizes
const disableScroll = (shouldDisableScroll) => css`
  body {
    ${shouldDisableScroll && 'overflow: hidden;'}
  }
`;

function UnifiedTocNavItem({ label, group, url, collapsible, items }) {
  // groups are for adding a static header, these can also be collapsible
  if (group) {
    return (
      <SideNavGroup header={label} collapsible={collapsible}>
        {items?.map((tocItem) => (
          <UnifiedTocNavItem {...tocItem} />
        ))}
      </SideNavGroup>
    );
  }

  // collapsible is for items that have nested links
  if (collapsible) {
    return (
      <SideNavItem className={cx(sideNavItemTOCStyling({ level: 1 }))}>
        {items?.map((tocItem) => (
          <UnifiedTocNavItem {...tocItem} />
        ))}
      </SideNavItem>
    );
  }
  return <SideNavItem>{label}</SideNavItem>;
}

export function UnifiedSidenav() {
  const tocTree = useUnifiedToc();

  console.log(tocTree);
  // Hide the Sidenav with css while keeping state as open/not collapsed.
  // This prevents LG's SideNav component from being seen in its collapsed state on mobile
  return (
    <>
      <Global
        styles={css`
          ${disableScroll(false)}
        `}
      />

      <SideNav
        widthOverride={300}
        className={css`
          height: 100vh; // sets height of SideNav
        `}
      >
        {tocTree.map((navItems) => (
          <UnifiedTocNavItem {...navItems} />
        ))}

        {/* <SideNavItem>Overview</SideNavItem>
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
        </SideNavItem> */}
      </SideNav>
    </>
  );
}
