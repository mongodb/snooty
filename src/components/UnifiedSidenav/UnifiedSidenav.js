import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import styled from '@emotion/styled';
import { SideNav, SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import { useViewportSize } from '@leafygreen-ui/hooks';
import { useLocation } from '@gatsbyjs/reach-router';
import { BackLink } from '@leafygreen-ui/typography';
import Link from '../Link';
import { sideNavItemUniTOCStyling, sideNavGroupTOCStyling } from '../Sidenav/styles/sideNavItem';
import { useUnifiedToc } from '../../hooks/use-unified-toc';
import { theme } from '../../theme/docsTheme';
import useScreenSize from '../../hooks/useScreenSize';
import { isCurrentPage } from '../../utils/is-current-page';
import { isSelectedTocNode } from '../../utils/is-selected-toc-node';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { VersionContext } from '../../context/version-context';
import useStickyTopValues from '../../hooks/useStickyTopValues';
import { HeaderContext } from '../Header/header-context';
import { SidenavContext } from '../Sidenav';
import useViewport from '../../hooks/useViewport';
import { SIDE_NAV_CONTAINER_ID } from '../../constants';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { assertLeadingSlash } from '../../utils/assert-leading-slash';
import { removeTrailingSlash } from '../../utils/remove-trailing-slash';

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

const getTopAndHeight = (topValue) => {
  return LeafyCSS`
    top: max(min(calc(${topValue} - var(--scroll-y))), ${theme.header.actionBarMobileHeight});
    height: calc(100vh - max(min(calc(${topValue} - var(--scroll-y))), ${theme.header.actionBarMobileHeight}));
  `;
};

const SidenavContainer = ({ topLarge, topMedium, topSmall }) => LeafyCSS`
  grid-area: sidenav;
  position: sticky;
  z-index: ${theme.zIndexes.sidenav};
  top: 0px;
  height: calc(
    100vh + ${theme.header.actionBarMobileHeight} - ${topLarge} +
      min(calc(${topLarge} - ${theme.header.actionBarMobileHeight}), var(--scroll-y))
  );

  @media ${theme.screenSize.upToLarge} {
    ${getTopAndHeight(topMedium)};
  }

  @media ${theme.screenSize.upToSmall} {
    ${getTopAndHeight(topSmall)};
  }
`;

const sideNavStyle = ({ hideMobile }) => LeafyCSS`  
  height: 100%;


  // Mobile & Tablet nav
  @media ${theme.screenSize.upToLarge} {
    position: absolute;
    ${hideMobile && 'display: none;'}

    button[data-testid="side-nav-collapse-toggle"] {
      display: none;
    }
  }
  
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
  overflow-y: auto;
  background-color: #f8f9fa;
  border-right: 3px solid #ddd;
`;

const rightPane = LeafyCSS`
  flex: 2;
  overflow-y: auto;
`;

// we will maybe have to edit this function in the future since if we have double panned side nav in theory two things should be selected at same time
function isSelectedTab(url, slug) {
  return isSelectedTocNode(url, slug);
}

function CollapsibleNavItem({ items, label, url, slug, prefix, level }) {
  const [isOpen, setIsOpen] = useState(isActiveTocNode(slug, url, items));
  const chevronType = isOpen ? 'ChevronDown' : 'ChevronRight';

  const onChevronClick = (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    // Allows the collapsed item if the chevron was selected first before
    if (!(url !== `/${slug}` && isOpen)) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <SideNavItem
        as={Link}
        prefix={prefix}
        to={url}
        active={isSelectedTab(url, slug)}
        className={cx(sideNavItemUniTOCStyling({ level }), overwriteLinkStyle)}
        onClick={handleClick}
        hideExternalIcon={true}
      >
        <FormatTitle>{label}</FormatTitle>
        <Icon className={cx(chevronStyle)} glyph={chevronType} fill={palette.gray.base} onClick={onChevronClick} />
      </SideNavItem>
      {isOpen &&
        items.map((item) => (
          <UnifiedTocNavItem {...item} level={level + 1} key={item.newUrl + item.label} slug={slug} />
        ))}
    </>
  );
}

function UnifiedTocNavItem({
  label,
  group,
  url,
  collapsible,
  items,
  isStatic,
  prefix,
  slug,
  drivers,
  currentL2s,
  isTabletOrMobile,
  setCurrentL2s,
  setShowDriverBackBtn,
  level,
}) {
  // These are the tab items that we dont need to show in the second pane but need to go through recursively
  // Unless in Mobile doing Accordion view
  if (isStatic) {
    if (isTabletOrMobile) {
      return (
        <>
          <StaticNavItem label={label} url={url} slug={slug} isStatic={isStatic} items={items} prefix={prefix} />
          {url === currentL2s &&
            items?.map((tocItem) => (
              <UnifiedTocNavItem
                {...tocItem}
                level={level}
                key={tocItem.newUrl + tocItem.label}
                slug={slug}
                isStatic={false}
                isTabletOrMobile={isTabletOrMobile}
                setCurrentL2s={setCurrentL2s}
              />
            ))}
        </>
      );
    }

    return (
      <>
        {items?.map((tocItem) => (
          <UnifiedTocNavItem
            {...tocItem}
            level={level}
            key={tocItem.newUrl + tocItem.label}
            slug={slug}
            isStatic={false}
            isTabletOrMobile={isTabletOrMobile}
            setCurrentL2s={setCurrentL2s}
            setShowDriverBackBtn={setShowDriverBackBtn}
          />
        ))}
      </>
    );
  }

  // groups are for adding a static header, these can also be collapsible
  if (group) {
    return (
      <SideNavGroup header={label} collapsible={collapsible} className={cx(sideNavGroupTOCStyling())}>
        {items?.map((tocItem) => (
          <UnifiedTocNavItem
            {...tocItem}
            level={level}
            key={tocItem.newUrl + tocItem.label}
            slug={slug}
            isTabletOrMobile={isTabletOrMobile}
            setCurrentL2s={setCurrentL2s}
            setShowDriverBackBtn={setShowDriverBackBtn}
          />
        ))}
      </SideNavGroup>
    );
  }

  const handleClick = () => {
    // Allows for the drivers nodes to have their own L2 panel
    setShowDriverBackBtn(true);
    setCurrentL2s({ items: items });
  };

  if (drivers) {
    return (
      <SideNavItem
        // active={isSelectedTab(url, slug)}
        aria-label={label}
        as={Link}
        prefix={prefix}
        to={url}
        onClick={handleClick}
        className={cx(sideNavItemUniTOCStyling({ level }))}
      >
        {label}
      </SideNavItem>
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
        prefix={prefix}
        className={cx(sideNavItemUniTOCStyling({ level }))}
      />
    );
  }

  return (
    <SideNavItem
      active={isSelectedTab(url, slug)}
      aria-label={label}
      as={Link}
      prefix={prefix}
      to={url}
      className={cx(sideNavItemUniTOCStyling({ level }))}
    >
      {label}
    </SideNavItem>
  );
}

function StaticNavItem({ label, url, slug, items, isStatic, prefix, setCurrentL1, level = 1 }) {
  return (
    <SideNavItem
      active={isActiveTocNode(slug, url, items)}
      aria-label={label}
      prefix={prefix}
      as={Link}
      to={url}
      onClick={() => {
        setCurrentL1({ items: items });
      }}
      className={cx(sideNavItemUniTOCStyling({ level, isStatic }))}
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

const replaceVersion = ({ url, currentVersion, versionsData }) => {
  // Find the version data for the current content we are in
  const noVersion = url.replace(/\$\{([^}]+)\}/g, '');
  const content = versionsData.find((obj) => obj.repoSlug.replaceAll('/', '') === noVersion.replaceAll('/', ''));
  if (!content) return;

  const proj = content.repoName;

  // based on the activeVersion, find the correct verion
  let ver = content?.version.find((obj) => obj.name === currentVersion[proj]);
  if (!ver) {
    // If no current version, use first version in the array
    ver = content.version[0];
  }

  // input the correct alias into the url
  const result = url?.replace(/\$\{([^}]+)\}/g, ver.urlSlug);

  return result;
};

// Function that adds a prefix to all the urls
const updateURLs = ({ tree, prefix, activeVersions, versionsData, project, snootyEnv }) => {
  return tree?.map((item) => {
    // Getting the path prefix and editing it based on the environment so links work correctly
    let updatedPrefix = prefix;
    if (item.prefix) {
      item.prefix =
        snootyEnv === 'dotcomprd'
          ? `/docs${item.prefix}`
          : snootyEnv === 'dotcomstg'
          ? `/docs-qa${item.prefix}`
          : item.prefix;
      const result = replaceVersion({
        url: item.prefix,
        currentVersion: activeVersions,
        versionsData,
        project,
      });
      // For incase result is undefined
      updatedPrefix = result ? result : item.prefix;
    }

    // Edit the url with the correct version path
    const newUrl = `${updatedPrefix}${item.url ? item.url : ''}`;

    const items = updateURLs({
      tree: item.items,
      prefix: updatedPrefix,
      activeVersions,
      versionsData,
      project,
      snootyEnv,
    });

    return {
      ...item,
      newUrl,
      items,
      prefix: updatedPrefix,
    };
  });
};

const findPageParent = (tree, targetUrl) => {
  const path = [];

  // If the page is apart of a driver toc, return driver as parent, if not return the L1
  const dfs = (item) => {
    path.push(item);

    if (assertLeadingSlash(removeTrailingSlash(item.url)) === assertLeadingSlash(removeTrailingSlash(targetUrl))) {
      for (let i = path.length - 1; i >= 0; i--) {
        if (path[i].drivers === true) {
          return [true, path[i]];
        }
      }
      // Page is not apart of a driver, returns the assosiated L1
      return [false, path[0]];
    }

    if (item.items) {
      for (const child of item.items) {
        const result = dfs(child);
        if (result) return result;
      }
    }

    path.pop();
    return null;
  };

  for (const item of tree) {
    const result = dfs(item);
    if (result) return result;
  }

  // Should not get here
  return [false, null];
};

export function UnifiedSidenav({ slug, versionsData }) {
  const unifiedTocTree = useUnifiedToc();
  const { project } = useSnootyMetadata();
  const { snootyEnv } = useSiteMetadata();
  const { activeVersions } = useContext(VersionContext);
  const { hideMobile, setHideMobile } = useContext(SidenavContext);
  const viewportSize = useViewportSize();
  const { isTabletOrMobile } = useScreenSize();
  const { bannerContent } = useContext(HeaderContext);
  const topValues = useStickyTopValues(false, true, !!bannerContent);
  const { pathname } = useLocation();

  const tree = useMemo(() => {
    return updateURLs({
      tree: unifiedTocTree,
      prefix: '',
      activeVersions,
      versionsData,
      project,
      snootyEnv,
    });
  }, [unifiedTocTree, activeVersions, versionsData, project, snootyEnv]);

  console.log('The edited toctree with prefixes is:', tree);
  console.log(unifiedTocTree);

  const [isDriver, currentL2List] = findPageParent(tree, slug);
  const [showDriverBackBtn, setShowDriverBackBtn] = useState(isDriver);
  const changeRef = useRef(showDriverBackBtn);

  useEffect(() => {
    changeRef.current = showDriverBackBtn;
  }, [showDriverBackBtn]);

  const [currentL1, setCurrentL1] = useState(() => {
    return tree.find((staticTocItem) => {
      return isActiveTocNode(slug, staticTocItem.url, staticTocItem.items);
    });
  });

  const [currentL2s, setCurrentL2s] = useState(() => {
    return currentL2List;
  });

  // Changes if L1 is selected/changed, but doesnt change on inital load
  useEffect(() => {
    if (!changeRef.current) setCurrentL2s(currentL1);
  }, [currentL1]);

  // close navigation panel on mobile screen, but leaves open if they click on a twisty
  useEffect(() => {
    setHideMobile(true);
  }, [pathname, setHideMobile]);

  // listen for scrolls for mobile and tablet menu
  const viewport = useViewport(false);

  // Hide the Sidenav with css while keeping state as open/not collapsed.
  // This prevents LG's SideNav component from being seen in its collapsed state on mobile
  return (
    <>
      <div
        className={cx(SidenavContainer({ ...topValues }))}
        style={{ '--scroll-y': `${viewport.scrollY}px` }}
        id={SIDE_NAV_CONTAINER_ID}
      >
        <SideNav
          widthOverride={isTabletOrMobile ? viewportSize.width : 375}
          className={cx(sideNavStyle({ hideMobile }))}
          aria-label="Side navigation Panel"
        >
          <div className={cx(leftPane)}>
            {isTabletOrMobile
              ? tree.map((navItems) => {
                  return (
                    <UnifiedTocNavItem
                      {...navItems}
                      level={1}
                      key={navItems.newUrl + navItems.label}
                      group={true}
                      isStatic={true}
                      currentL2s={currentL2s.url}
                      isTabletOrMobile={isTabletOrMobile}
                      setCurrentL2s={setCurrentL2s}
                    />
                  );
                })
              : tree.map((staticTocItem) => {
                  return (
                    <StaticNavItem
                      {...staticTocItem}
                      slug={slug}
                      key={staticTocItem.newUrl + staticTocItem.label}
                      isStatic={true}
                      setCurrentL1={setCurrentL1}
                    />
                  );
                })}
          </div>
          {currentL2s && !isTabletOrMobile && (
            <div className={cx(rightPane)}>
              {showDriverBackBtn && (
                <BackLink
                  onClick={() => {
                    setCurrentL2s(currentL1);
                    setShowDriverBackBtn(false);
                  }}
                >
                  Back to Client Libraries
                </BackLink>
              )}
              {currentL2s.items?.map((navItems) => {
                return (
                  <UnifiedTocNavItem
                    {...navItems}
                    level={1}
                    key={navItems.newUrl + navItems.label}
                    slug={slug}
                    setCurrentL2s={setCurrentL2s}
                    setShowDriverBackBtn={setShowDriverBackBtn}
                  />
                );
              })}
            </div>
          )}
        </SideNav>
      </div>
    </>
  );
}
