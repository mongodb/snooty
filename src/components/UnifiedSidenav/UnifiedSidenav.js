import React, { useState, useEffect, useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import { SideNav, SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import { useViewportSize } from '@leafygreen-ui/hooks';
import { useLocation } from '@gatsbyjs/reach-router';
import { BackLink } from '@leafygreen-ui/typography';
import Link from '../Link';
// import { L2ItemStlying, sideNavGroupTOCStyling } from '../Sidenav/styles/sideNavItem';
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
import DocsHomeButton from '../Sidenav/DocsHomeButton';
import { L1ItemStlying, groupHeaderStyling, L2ItemStlying, backLinkStyling } from './styles/SideNavItem';

const ArtificialPadding = styled('div')`
  height: 15px;
`;

export const Border = styled('hr')`
  border: unset;
  border-bottom: 1px solid var(--sidenav-border-bottom-color);
  margin: ${theme.size.small} 0;
  width: 100%;
`;

const NavTopContainer = styled('div')`
  background-color: var(--background-color-primary);
  // position: relative;
  position: absolute;
  top: -0px;
  height: 60px;
  width: 100%;
  border-bottom: 1px solid var(--sidenav-border-bottom-color);
  z-index: 1;
`;

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

  nav {
    background-color: var(--sidenav-bg-color);
  }

   a[class*='lg-ui-side-nav-item'] {
      color: var(--sidenav-item-color);
      :not([aria-current='page']):hover {
        background-color: var(--sidenav-hover-bg-color);
      }
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
  // div > ul > div {
  //   display: flex;
  //   flex-direction: row;
  //   // position: relative; 
  //   // width: 400px;
  //   // height: 100vh;
  //   // overflow-y: auto;
  //   // position: fixed;
  //   // left: 0;
  //   top: 50px;


  //   ul {
  //     display: block;
  //     width: 100%;

  //     li {
  //       a {
  //         justify-content: space-between !important;
  //       }
  //     }
  //   }

  // }
`;

const designStyle = LeafyCSS`
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 50px;
    height: 100%;
    padding-top: 10px;


    ul {
      display: block;
      width: 100%;

      li {
        a {
          justify-content: space-between !important;
        }
      }
    }

`;

const leftPane = LeafyCSS`
  flex: 0 0 162px;
  overflow-y: auto;
  border-right: 1px solid var(--sidenav-border-bottom-color);
  width: 162px !important;
  padding-top: ${theme.size.default};
`;

const rightPane = LeafyCSS`
  flex: 0 0 264px;
  overflow-y: auto;
  border-right: 1px solid var(--sidenav-border-bottom-color);
  padding-top: ${theme.size.default};
`;

// we will maybe have to edit this function in the future since if we have double panned side nav in theory two things should be selected at same time
function isSelectedTab(url, slug) {
  return isSelectedTocNode(url, slug);
}

function CollapsibleNavItem({ items, label, url, slug, prefix, level }) {
  const [isOpen, setIsOpen] = useState(isActiveTocNode(slug, url, items));
  const chevronType = isOpen ? 'CaretDown' : 'CaretUp';
  const isActive = isSelectedTab(url, slug);

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
        active={isActive}
        className={cx(L2ItemStlying({ level }), overwriteLinkStyle)}
        onClick={handleClick}
        hideExternalIcon={true}
      >
        <FormatTitle>{label}</FormatTitle>
        <Icon
          className={cx(chevronStyle)}
          glyph={chevronType}
          fill={isActive ? palette.green.dark2 : palette.gray.base}
          onClick={onChevronClick}
        />
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
  showSubNav,
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
          <StaticNavItem
            label={label}
            url={url}
            slug={slug}
            isStatic={isStatic}
            items={items}
            prefix={prefix}
            setShowDriverBackBtn={setShowDriverBackBtn}
          />
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
      <SideNavGroup header={label} collapsible={collapsible} className={cx(groupHeaderStyling())}>
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
    // Allows for the showSubNav nodes to have their own L2 panel
    setShowDriverBackBtn(true);
    setCurrentL2s({ items });
  };

  if (showSubNav) {
    return (
      <SideNavItem
        aria-label={label}
        as={Link}
        prefix={prefix}
        to={url}
        onClick={handleClick}
        className={cx(L2ItemStlying({ level }))}
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
        className={cx(L2ItemStlying({ level }))}
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
      className={cx(L2ItemStlying({ level }))}
    >
      {label}
    </SideNavItem>
  );
}

function StaticNavItem({ label, url, slug, items, isStatic, prefix, setCurrentL1, setShowDriverBackBtn, level = 1 }) {
  return (
    <SideNavItem
      active={isActiveTocNode(slug, url, items)}
      aria-label={label}
      prefix={prefix}
      as={Link}
      to={url}
      onClick={() => {
        setCurrentL1({ items: items });
        setShowDriverBackBtn(false);
      }}
      className={cx(L1ItemStlying())}
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

  // If the page is a part of a driver toc, return driver as parent, if not return the L1
  const dfs = (item) => {
    path.push(item);

    if (assertLeadingSlash(removeTrailingSlash(item.url)) === assertLeadingSlash(removeTrailingSlash(targetUrl))) {
      for (let i = path.length - 1; i >= 0; i--) {
        if (path[i].showSubNav === true) {
          return [true, path[i]];
        }
      }
      // Page is not a part of a driver, returns the associated L1
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

  // No L1 selected (docs home page)
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

  const [currentL1, setCurrentL1] = useState(() => {
    return tree.find((staticTocItem) => {
      return isActiveTocNode(slug, staticTocItem.url, staticTocItem.items);
    });
  });
  const sideNavSize = currentL1 ? 426 : 161;

  const [currentL2s, setCurrentL2s] = useState(() => {
    return currentL2List;
  });

  // Changes if L1 is selected/changed, but doesnt change on inital load
  useEffect(() => {
    if (!showDriverBackBtn) setCurrentL2s(currentL1);
  }, [currentL1, showDriverBackBtn]);

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
          widthOverride={isTabletOrMobile ? viewportSize.width : sideNavSize}
          className={cx(sideNavStyle({ hideMobile }))}
          aria-label="Side navigation Panel"
        >
          <NavTopContainer>
            <ArtificialPadding />
            <DocsHomeButton />
          </NavTopContainer>
          <div className={cx(designStyle)}>
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
                        setShowDriverBackBtn={setShowDriverBackBtn}
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
                        setShowDriverBackBtn={setShowDriverBackBtn}
                      />
                    );
                  })}
            </div>
            {currentL2s && !isTabletOrMobile && (
              <div className={cx(rightPane)}>
                {showDriverBackBtn && (
                  <BackLink
                    className={cx(backLinkStyling())}
                    onClick={() => {
                      setShowDriverBackBtn(false);
                    }}
                    // href="/master/java/bianca.laube/testing-delete/builders/index.html"
                    href="/builders"
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
          </div>
        </SideNav>
      </div>
    </>
  );
}
