import React, { useState, useEffect, useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import { useLocation } from '@gatsbyjs/reach-router';
import { useUnifiedToc } from '../../hooks/use-unified-toc';
import { theme } from '../../theme/docsTheme';
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
import { isActiveTocNode } from '../../utils/is-active-toc-node';
import { DoublePannedNav } from './DoublePannedNav';
import { AccordionNavPanel } from './AccordionNav';

export const ArtificialPadding = styled('div')`
  height: 15px;
`;

export const downloadButtonStlying = LeafyCSS`
  bottom: 20px;
  position: absolute;
  width: 100%;
  text-align: right;
  padding-right: 30px;
`;

export const NavTopContainer = (isTabletOrMobile) => LeafyCSS`
  ${!isTabletOrMobile && 'background-color: var(--background-color-primary)'};
  position: absolute;
  top: -0px;
  height: 60px;
  width: 100%;
  border-bottom: 1px solid var(--sidenav-border-bottom-color);
  z-index: 1;
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

const replaceVersion = ({ url, currentVersion, versionsData }) => {
  // Find the version data for the current content we are in
  const noVersion = url.replace(/\$\{([^}]+)\}/g, '');
  const content = versionsData.find((obj) => obj.repoSlug.replaceAll('/', '') === noVersion.replaceAll('/', ''));
  if (!content) return url;

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

// TODO: this function needs to be updated with DOP-5677
// Function that adds a prefix to all the urls
const updateURLs = ({ tree, prefix, activeVersions, versionsData, project, snootyEnv }) => {
  return tree?.map((item) => {
    // Getting the path prefix and editing it based on the environment so links work correctly
    let updatedPrefix = prefix;
    if (item.prefix) {
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
    const newUrl = `${item.url ? item.url : ''}`;

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
  const { snootyEnv, pathPrefix } = useSiteMetadata();
  const { activeVersions } = useContext(VersionContext);
  const { hideMobile, setHideMobile } = useContext(SidenavContext);
  const { bannerContent } = useContext(HeaderContext);
  const topValues = useStickyTopValues(false, true, !!bannerContent);
  const { pathname } = useLocation();
  slug = slug === '/' ? pathPrefix + slug : `${pathPrefix}/${slug}/`;

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

  // Initialize state with default values instead of computed values
  const [showDriverBackBtn, setShowDriverBackBtn] = useState(false);
  const [currentL1, setCurrentL1] = useState(null);
  const [currentL2s, setCurrentL2s] = useState(null);

  useEffect(() => {
    if (tree && tree.length > 0) {
      const [isDriver, currentL2List] = findPageParent(tree, slug);
      setShowDriverBackBtn(isDriver);

      const foundCurrentL1 = tree.find((staticTocItem) => {
        return isActiveTocNode(slug, staticTocItem.url, staticTocItem.items);
      });
      setCurrentL1(foundCurrentL1);
      setCurrentL2s(currentL2List);
    }
  }, [tree, slug]);

  // Changes if L1 is selected/changed, but doesnt change on inital load
  useEffect(() => {
    if (!showDriverBackBtn && currentL1) {
      setCurrentL2s(currentL1);
    }
  }, [currentL1, showDriverBackBtn]);

  // close navigation panel on mobile screen, but leaves open if they click on a twisty
  useEffect(() => {
    setHideMobile(true);
  }, [pathname, setHideMobile]);

  // listen for scrolls for mobile and tablet menu
  const viewport = useViewport(false);

  const displayedItems = showDriverBackBtn ? currentL2s?.items : tree;

  // Hide the Sidenav with css while keeping state as open/not collapsed.
  // This prevents LG's SideNav component from being seen in its collapsed state on mobile
  return (
    <>
      <div
        className={cx(SidenavContainer({ ...topValues }))}
        style={{ '--scroll-y': `${viewport.scrollY}px` }}
        id={SIDE_NAV_CONTAINER_ID}
      >
        <AccordionNavPanel
          showDriverBackBtn={showDriverBackBtn}
          setShowDriverBackBtn={setShowDriverBackBtn}
          displayedItems={displayedItems}
          slug={slug}
          currentL2s={currentL2s}
          setCurrentL1={setCurrentL1}
          setCurrentL2s={setCurrentL2s}
          hideMobile={hideMobile}
        />
        <DoublePannedNav
          showDriverBackBtn={showDriverBackBtn}
          setShowDriverBackBtn={setShowDriverBackBtn}
          tree={tree}
          slug={slug}
          currentL2s={currentL2s}
          setCurrentL1={setCurrentL1}
          setCurrentL2s={setCurrentL2s}
          currentL1={currentL1}
        />
      </div>
    </>
  );
}
