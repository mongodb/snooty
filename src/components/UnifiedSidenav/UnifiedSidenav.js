import React, { useState } from 'react';
import styled from '@emotion/styled';
import { SideNav, SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import { css, Global } from '@emotion/react';
import { cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';

import { sideNavItemTOCStyling } from '../Sidenav/styles/sideNavItem';
import { useUnifiedToc } from '../../hooks/use-unified-toc';
import { theme } from '../../theme/docsTheme';

// Prevent content scrolling when the side nav is open on mobile and tablet screen sizes
const disableScroll = (shouldDisableScroll) => css`
  body {
    ${shouldDisableScroll && 'overflow: hidden;'}
  }
`;

const caretStyle = css`
  margin-top: 3px;
  margin-right: 5px;
  min-width: 16px;
`;

const FormatTitle = styled.div`
  margin-left: var(--margin-left);
  scroll-margin-bottom: ${theme.size.xxlarge};
`;

function CollapsibleNavItem({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const iconType = isOpen ? 'CaretDown' : 'CaretRight';
  const onCaretClick = (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };
  return (
    <SideNavItem className={cx(sideNavItemTOCStyling({ level: 1 }))}>
      <FormatTitle></FormatTitle>
      <Icon className={cx(caretStyle)} glyph={iconType} fill={palette.gray.base} onClick={onCaretClick} />

      {items?.map((tocItem) => (
        <UnifiedTocNavItem {...tocItem} />
      ))}
    </SideNavItem>
  );
}

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
    return <CollapsibleNavItem items={items} label={label} />;
  }
  return <SideNavItem>{label}</SideNavItem>;
}

export function UnifiedSidenav() {
  const tocTree = useUnifiedToc();

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
      </SideNav>
    </>
  );
}
