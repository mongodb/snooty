import React, { useState } from 'react';
import styled from '@emotion/styled';
import { SideNav, SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import { css, Global } from '@emotion/react';
import { cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import Link from '../Link';

import { sideNavItemTOCStyling } from '../Sidenav/styles/sideNavItem';
import { useUnifiedToc } from '../../hooks/use-unified-toc';
import { theme } from '../../theme/docsTheme';

const FormatTitle = styled.div`
  margin-left: var(--margin-left);
  scroll-margin-bottom: ${theme.size.xxlarge};
`;

const caretStyle = css`
  margin-top: 3px;
  margin-right: 5px;
  min-width: 16px;
`;

function isSelectedTab(slug) {
  return window.location.pathname === `${slug}/`;
}
function CollapsibleNavItem({ items, label, url, level = 1 }) {
  const [isOpen, setIsOpen] = useState(false);
  const iconType = isOpen ? 'CaretDown' : 'CaretRight';

  const onCaretClick = (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  console.log();
  return (
    <>
      <SideNavItem
        hideExternalIcon={true}
        as="a"
        active={isSelectedTab(url)}
        className={cx(sideNavItemTOCStyling({ level }))}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon className={cx(caretStyle)} glyph={iconType} fill={palette.gray.base} onClick={onCaretClick} />
        <FormatTitle style={{ '--margin-left': '3px' }}>{label}</FormatTitle>
      </SideNavItem>
      {isOpen && items.map((item) => <UnifiedTocNavItem {...item} level={level + 1} />)}
    </>
  );
}

function UnifiedTocNavItem({ label, group, url, collapsible, items, level = 1 }) {
  // groups are for adding a static header, these can also be collapsible
  if (group) {
    return (
      <SideNavGroup header={label} collapsible={collapsible} className={cx(sideNavItemTOCStyling({ level }))}>
        {items?.map((tocItem) => (
          <UnifiedTocNavItem {...tocItem} />
        ))}
      </SideNavGroup>
    );
  }

  // collapsible is for items that have nested links
  if (collapsible) {
    return (
      <CollapsibleNavItem items={items} label={label} url={url} className={cx(sideNavItemTOCStyling({ level }))} />
    );
  }

  return (
    <SideNavItem
      active={isSelectedTab(url)}
      aria-label={label}
      as={Link}
      to={url}
      className={cx(sideNavItemTOCStyling({ level }))}
    >
      {label}
    </SideNavItem>
  );
}

export function UnifiedSidenav() {
  const tocTree = useUnifiedToc();

  // Hide the Sidenav with css while keeping state as open/not collapsed.
  // This prevents LG's SideNav component from being seen in its collapsed state on mobile
  return (
    <>
      <Global />

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
