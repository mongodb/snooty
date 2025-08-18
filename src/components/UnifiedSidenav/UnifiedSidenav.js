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
import { useIsValidVersion } from '../../hooks/use-is-valid-version';
import { assertLeadingSlash } from '../../utils/assert-leading-slash';
import { removeTrailingSlash } from '../../utils/remove-trailing-slash';
import { removeLeadingSlash } from '../../utils/remove-leading-slash';
import { isBrowser } from '../../utils/is-browser';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { isActiveTocNode } from './UnifiedTocNavItems';
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

// Function that adds the current version
const updateURLs = ({ tree, contentSite, activeVersions, versionsData, project }) => {
  return tree?.map((item) => {
    let newUrl = item.url ?? '';
    const currentProject = item.contentSite ?? contentSite;

    // Replace version variable with the true current version
    if (item?.url?.includes(':version')) {
      const version = (versionsData[currentProject] || []).find(
        (version) =>
          version.gitBranchName === activeVersions[currentProject] ||
          version.urlSlug === activeVersions[currentProject] ||
          version?.urlAliases?.includes(activeVersions[currentProject])
      );
      // If no version use first version.urlSlug in the list, or if no version loads, set as current
      const defaultVersion = versionsData[currentProject]?.[0]?.urlSlug ?? 'current';
      const currentVersion = version?.urlSlug ?? defaultVersion;
      newUrl = item.url.replace(/:version/g, currentVersion);
    }

    const items = updateURLs({
      tree: item.items,
      contentSite: currentProject,
      activeVersions,
      versionsData,
      project,
    });

    return {
      ...item,
      newUrl,
      items,
      contentSite: currentProject,
    };
  });
};

const findPageParent = (tree, targetUrl) => {
  const path = [];

  // If the page is a part of a driver toc, return driver as parent, if not return the L1
  const dfs = (item) => {
    path.push(item);

    if (assertLeadingSlash(removeTrailingSlash(item.newUrl)) === assertLeadingSlash(removeTrailingSlash(targetUrl))) {
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

export function UnifiedSidenav({ slug }) {
  const unifiedTocTree = useUnifiedToc();
  const { project } = useSnootyMetadata();
  const { pathPrefix } = useSiteMetadata();
  const isValidVersion = useIsValidVersion();
  const { activeVersions, availableVersions } = useContext(VersionContext);
  const { hideMobile, setHideMobile } = useContext(SidenavContext);
  const { hasBanner } = useContext(HeaderContext);
  const topValues = useStickyTopValues(false, true, hasBanner);
  const { pathname, hash } = useLocation();
  const tempSlug = isBrowser ? removeLeadingSlash(removeTrailingSlash(window.location.pathname)) : slug;
  slug = tempSlug?.startsWith('docs/')
    ? tempSlug
    : tempSlug === '/'
    ? pathPrefix + tempSlug
    : `${pathPrefix}/${tempSlug}/`;
  slug = assertTrailingSlash(slug) + hash;

  const tree = useMemo(() => {
    return updateURLs({
      tree: unifiedTocTree,
      activeVersions,
      versionsData: availableVersions,
      project,
    });
  }, [unifiedTocTree, activeVersions, availableVersions, project]);

  const [isDriver, currentL2List] = findPageParent(tree, slug);
  const [showDriverBackBtn, setShowDriverBackBtn] = useState(isDriver);

  const [currentL1, setCurrentL1] = useState(() => {
    return tree.find((staticTocItem) => {
      return isActiveTocNode(slug, staticTocItem.newUrl, staticTocItem.items);
    });
  });

  const [currentL2s, setCurrentL2s] = useState(currentL2List);

  useEffect(() => {
    const [isDriver, updatedL2s] = findPageParent(tree, slug);
    const updatedL1s = tree.find((staticTocItem) => {
      return isActiveTocNode(slug, staticTocItem.newUrl, staticTocItem.items);
    });

    setShowDriverBackBtn(isDriver);
    setCurrentL1(updatedL1s);
    setCurrentL2s(updatedL2s);
  }, [tree]); // eslint-disable-line react-hooks/exhaustive-deps

  // close navigation panel on mobile screen, but leaves open if they click on a twisty
  useEffect(() => {
    setHideMobile(true);
  }, [pathname, setHideMobile]);

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(removeTrailingSlash(hash));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  // listen for scrolls for mobile and tablet menu
  const viewport = useViewport(false);

  // Hide the Sidenav with css while keeping state as open/not collapsed.
  // This prevents LG's SideNav component from being seen in its collapsed state on mobile
  return isValidVersion ? (
    <div
      className={cx(SidenavContainer({ ...topValues }))}
      style={{ '--scroll-y': `${viewport.scrollY}px` }}
      id={SIDE_NAV_CONTAINER_ID}
    >
      <AccordionNavPanel
        showDriverBackBtn={showDriverBackBtn}
        setShowDriverBackBtn={setShowDriverBackBtn}
        slug={slug}
        currentL2s={currentL2s}
        setCurrentL1={setCurrentL1}
        setCurrentL2s={setCurrentL2s}
        hideMobile={hideMobile}
        currentL1={currentL1}
        tree={tree}
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
  ) : (
    <div />
  );
}
