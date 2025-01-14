import React, { useState } from 'react';
import styled from '@emotion/styled';
import { SideNav, SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import { Global } from '@emotion/react';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import Link from '../Link';
// import { formatText } from '../../utils/format-text';

import { sideNavItemTOCStyling, sideNavGroupTOCStyling } from '../Sidenav/styles/sideNavItem';
import { useUnifiedToc } from '../../hooks/use-unified-toc';
import { theme } from '../../theme/docsTheme';
import { isBrowser } from '../../utils/is-browser';

const FormatTitle = styled.div`
  scroll-margin-bottom: ${theme.size.xxlarge};
`;
const overwriteLinkStyle = LeafyCSS`
  span {
    display: flex;
  }
`;
const sideNavStyle = LeafyCSS`
  padding: 0px;
  div > ul {
    display: flex;
    flex-direction: row;
    // width: 400px;
    // height: 100vh;
    // overflow-y: auto;
    // position: fixed;
    // left: 0;
    // top: 0;

    ul {
      display: block;
      width: 100%;

      li {
        a {
          justify-content: space-between !important;
        }
      }
    }
  }
`;

const leftPane = LeafyCSS`
  flex: 1;
  // padding: 10px;
  overflow-y: auto;
  background-color: #f8f9fa;
  border-right: 3px solid #ddd;
`;

const rightPane = LeafyCSS`
  flex: 2;
  // padding: 10px;
  overflow-y: auto;
`;

// we will have to edit this function in the future since if we have double panned side nav in theory two things should be selected at same time
function isSelectedTab(slug) {
  if (!isBrowser) return false;

  return window.location.pathname === `${slug}/`;
}

function CollapsibleNavItem({ items, label, url, level }) {
  const [isOpen, setIsOpen] = useState(false);
  const chevronType = isOpen ? 'ChevronDown' : 'ChevronRight';

  const onChevronClick = (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <SideNavItem
        as={Link}
        to={url}
        active={isSelectedTab(url)}
        className={cx(sideNavItemTOCStyling({ level }), overwriteLinkStyle)}
        onClick={() => setIsOpen(!isOpen)}
        hideExternalIcon={true}
      >
        <FormatTitle>{label}</FormatTitle>
        <Icon glyph={chevronType} fill={palette.gray.base} onClick={onChevronClick} />
      </SideNavItem>
      {isOpen && items.map((item) => <UnifiedTocNavItem {...item} level={level + 1} />)}
    </>
  );
}

function UnifiedTocNavItem({ label, group, url, collapsible, items, isTab, level }) {
  // these are the tab items that we dont need to show in the second pane but need to go through recursively
  if (isTab) {
    return (
      <>
        {items?.map((tocItem) => (
          <UnifiedTocNavItem {...tocItem} level={level} />
        ))}
      </>
    );
  }

  // groups are for adding a static header, these can also be collapsible
  if (group) {
    return (
      <SideNavGroup header={label} collapsible={collapsible} className={cx(sideNavGroupTOCStyling({ level }))}>
        {items?.map((tocItem) => (
          <UnifiedTocNavItem {...tocItem} level={level} />
        ))}
      </SideNavGroup>
    );
  }

  // collapsible is for items that have nested links
  if (collapsible) {
    return (
      <CollapsibleNavItem
        items={items}
        label={label}
        url={url}
        level={level}
        className={cx(sideNavItemTOCStyling({ level }))}
      />
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

function StaticNavItem({ label, group, url, collapsible, items, glyph, isTab, setActiveTab, level = 1 }) {
  return (
    <SideNavItem
      active={isSelectedTab(url)}
      glyph={<Icon glyph={glyph} />}
      aria-label={label}
      as={Link}
      to={url}
      className={cx(sideNavItemTOCStyling({ level }))}
      onClick={() => setActiveTab(`${url}/`)}
    >
      {label}
    </SideNavItem>
  );
}

export function UnifiedSidenav() {
  const unifiedTocTree = useUnifiedToc();
  const [activeTab, setActiveTab] = useState(window.location.pathname);
  const staticToc = unifiedTocTree.filter((item) => item?.isTab);

  // Hide the Sidenav with css while keeping state as open/not collapsed.
  // This prevents LG's SideNav component from being seen in its collapsed state on mobile
  return (
    <>
      <Global />
      <SideNav widthOverride={400} className={cx(sideNavStyle)} aria-label="Bianca's Side navigation">
        <div className={cx(leftPane)}>
          {staticToc.map((navItems) => {
            return <StaticNavItem {...navItems} setActiveTab={setActiveTab} />;
          })}
        </div>
        <div className={cx(rightPane)}>
          {unifiedTocTree.map((navItems) => {
            if (`${navItems.url}/` === activeTab) {
              return <UnifiedTocNavItem {...navItems} level={1} />;
            }
            return null;
          })}
        </div>
      </SideNav>
    </>
  );
}
