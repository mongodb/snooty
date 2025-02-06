import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { SideNav, SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import Link from '../Link';
import { sideNavItemUniTOCStyling, sideNavGroupTOCStyling } from '../Sidenav/styles/sideNavItem';
import { useUnifiedToc } from '../../hooks/use-unified-toc';
import { theme } from '../../theme/docsTheme';
import { isCurrentPage } from '../../utils/is-current-page';
import { isSelectedTocNode } from '../../utils/is-selected-toc-node';

const FormatTitle = styled.div`
  scroll-margin-bottom: ${theme.size.xxlarge};
`;

const overwriteLinkStyle = LeafyCSS`
  span {
    display: flex;
  }
`;

const chevronStyle = LeafyCSS`
  margin-top: 3px;
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

// we will maybe have to edit this function in the future since if we have double panned side nav in theory two things should be selected at same time
function isSelectedTab(url, slug) {
  return isSelectedTocNode(url, slug);
}

function CollapsibleNavItem({ items, label, url, slug, level }) {
  const [isOpen, setIsOpen] = useState(false);
  const chevronType = isOpen ? 'ChevronDown' : 'ChevronRight';

  const onChevronClick = (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    // Allows the collapsed item if the chevren was selected first before
    if (!(url !== `/${slug}` && isOpen)) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <SideNavItem
        as={Link}
        to={url}
        active={isSelectedTab(url, slug)}
        className={cx(sideNavItemUniTOCStyling({ level }), overwriteLinkStyle)}
        onClick={handleClick}
        hideExternalIcon={true}
      >
        <FormatTitle>{label}</FormatTitle>
        <Icon className={cx(chevronStyle)} glyph={chevronType} fill={palette.gray.base} onClick={onChevronClick} />
      </SideNavItem>
      {isOpen && items.map((item) => <UnifiedTocNavItem {...item} level={level + 1} slug={slug} />)}
    </>
  );
}

function UnifiedTocNavItem({ label, group, url, collapsible, items, isTab, slug, level }) {
  // these are the tab items that we dont need to show in the second pane but need to go through recursively
  if (isTab) {
    return (
      <>
        {items?.map((tocItem) => (
          <UnifiedTocNavItem {...tocItem} level={level} slug={slug} />
        ))}
      </>
    );
  }

  // groups are for adding a static header, these can also be collapsible
  if (group) {
    return (
      <SideNavGroup header={label} collapsible={collapsible} className={cx(sideNavGroupTOCStyling({ level }))}>
        {items?.map((tocItem) => (
          <UnifiedTocNavItem {...tocItem} level={level} slug={slug} />
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
        slug={slug}
        className={cx(sideNavItemUniTOCStyling({ level }))}
      />
    );
  }

  return (
    <SideNavItem
      active={isSelectedTab(url, slug)}
      aria-label={label}
      as={Link}
      to={url}
      className={cx(sideNavItemUniTOCStyling({ level }))}
    >
      {label}
    </SideNavItem>
  );
}

function StaticNavItem({ label, url, glyph, slug, items, level = 1 }) {
  return (
    <SideNavItem
      active={isActiveTocNode(slug, url, items)}
      glyph={<Icon glyph={glyph} />}
      aria-label={label}
      as={Link}
      to={url}
      className={cx(sideNavItemUniTOCStyling({ level }))}
    >
      {label}
    </SideNavItem>
  );
}

// This checks what sidenav should load based on the active Tab
const isActiveTocNode = (currentUrl, slug, children) => {
  if (currentUrl === undefined) return false;
  if (isCurrentPage(currentUrl, slug)) return true;
  if (children) {
    return children.reduce((a, b) => a || isActiveTocNode(currentUrl, b.url, b.items), false);
  }
  return false;
};

export function UnifiedSidenav({ slug }) {
  const unifiedTocTree = useUnifiedToc();
  const staticTocItems = useMemo(() => {
    return unifiedTocTree.filter((item) => item?.isTab);
  }, [unifiedTocTree]);

  const [activeTabUrl, setActiveTabUrl] = useState(() => {
    const activeToc = staticTocItems.find((staticTocItem) => {
      return isActiveTocNode(slug, staticTocItem.url, staticTocItem.items);
    });
    return activeToc?.url;
  });

  useEffect(() => {
    setActiveTabUrl(() => {
      const activeToc = staticTocItems.find((staticTocItem) => {
        return isActiveTocNode(slug, staticTocItem.url, staticTocItem.items);
      });
      return activeToc?.url;
    });
  }, [slug, staticTocItems]);

  // Hide the Sidenav with css while keeping state as open/not collapsed.
  // This prevents LG's SideNav component from being seen in its collapsed state on mobile
  return (
    <>
      <SideNav widthOverride={400} className={cx(sideNavStyle)} aria-label="Bianca's Side navigation">
        <div className={cx(leftPane)}>
          {staticTocItems.map((staticTocItem) => {
            // biome-ignore lint/correctness/useJsxKeyInIterable: iterating through navItems which doesn't have a key
            return <StaticNavItem {...staticTocItem} slug={slug} />;
          })}
        </div>
        {activeTabUrl && (
          <div className={cx(rightPane)}>
            {unifiedTocTree.map((navItems) => {
              if (navItems.url === activeTabUrl) {
                return <UnifiedTocNavItem {...navItems} level={1} slug={slug} />;
              }
              return null;
            })}
          </div>
        )}
      </SideNav>
    </>
  );
}
