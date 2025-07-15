import React, { useEffect, useContext, useMemo, useReducer } from 'react';
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

// Function that adds the current version
const updateURLs = ({ tree, contentSite, activeVersions, versionsData, project, snootyEnv }) => {
  return tree?.map((item) => {
    let newUrl = item.url ?? '';
    const currentProject = item.contentSite ?? contentSite;

    // Replace version variable with the true current version
    if (item?.url?.includes(':version')) {
      const version = (versionsData[currentProject] || []).find(
        (version) => version.gitBranchName === activeVersions[currentProject]
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
      snootyEnv,
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

const UPDATE_CURRENT_L2S = 'update-current-l2s';
const SET_SHOW_DRIVER_BACK_BTN = 'set-show-driver-back-btn';

function reducer(state, action) {
  const { type } = action;
  switch (type) {
    case UPDATE_CURRENT_L2S:
      return {
        currentL2s: state.currentL2s,
      };
    case SET_SHOW_DRIVER_BACK_BTN:
      return {
        showDriverBackBtn: state.showDriverBackBtn,
      };
    default:
      return { ...state };
  }
}

export function UnifiedSidenav({ slug }) {
  const unifiedTocTree = useUnifiedToc();
  const { project } = useSnootyMetadata();
  const { snootyEnv, pathPrefix } = useSiteMetadata();
  const { activeVersions, availableVersions } = useContext(VersionContext);
  const { hideMobile, setHideMobile } = useContext(SidenavContext);
  const { bannerContent } = useContext(HeaderContext);
  const topValues = useStickyTopValues(false, true, !!bannerContent);
  const { pathname } = useLocation();
  slug = slug === '/' ? pathPrefix + slug : `${pathPrefix}/${slug}/`;

  const tree = useMemo(() => {
    return updateURLs({
      tree: unifiedTocTree,
      activeVersions,
      versionsData: availableVersions,
      project,
      snootyEnv,
    });
  }, [unifiedTocTree, activeVersions, availableVersions, project, snootyEnv]);

  console.log('The edited toctree with prefixes is:', tree);
  console.log(unifiedTocTree);

  console.log('slug', slug);
  const foundCurrentL1 = tree.find((staticTocItem) => {
    console.log('staticTocItem', staticTocItem);
    return isActiveTocNode(slug, staticTocItem.newUrl, staticTocItem.items);
  });

  console.log('foundCurrentL1', foundCurrentL1);

  const initialState = { currentL2s: {}, currentL1: {}, showDriverBackBtn: false };

  const [tocData, dispatch] = useReducer(reducer, initialState, () => {
    const [isDriver, currentL2List] = findPageParent(tree, slug);
    return {
      currentL2s: currentL2List,
      showDriverBackBtn: isDriver,
      currentL1: foundCurrentL1,
    };
  });

  // const [showDriverBackBtn, setShowDriverBackBtn] = useState(isDriver);

  // const [currentL1, setCurrentL1] = useState(() => {
  //   return ;
  // });

  console.log('currentL1 -->', tocData.currentL1);

  // const [currentL2s, setCurrentL2s] = useState(currentL2List);
  console.log('toc data currentL2s -->', tocData.currentL2s);

  console.log('showDriverBackBtn', tocData.showDriverBackBtn);

  console.log('toc data', tocData);

  // Changes if L1 is selected/changed, but doesnt change on inital load
  // useEffect(() => {
  //   if (!tocData.showDriverBackBtn) {
  //     dispatch({
  //       type: UPDATE_CURRENT_L2S,
  //       currentL2s: tocData.currentL1,
  //     })
  //   }
  // }, [tocData.currentL1, tocData.showDriverBackBtn]);
  // close navigation panel on mobile screen, but leaves open if they click on a twisty
  useEffect(() => {
    setHideMobile(true);
  }, [pathname, setHideMobile]);

  // listen for scrolls for mobile and tablet menu
  const viewport = useViewport(false);

  const displayedItems = tocData.showDriverBackBtn ? tocData.currentL2s?.items : tree;

  console.log('showDriverBackBtn', tocData.showDriverBackBtn);
  console.log('displayedItems ', displayedItems);

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
          showDriverBackBtn={tocData.showDriverBackBtn}
          setShowDriverBackBtn={(shouldShowDriverBackBtn) => {
            console.log('shouldShowDriverBackBtn in setCurrentL1 for AccordionNavPanel', shouldShowDriverBackBtn);
            dispatch({ type: SET_SHOW_DRIVER_BACK_BTN, showDriverBackBtn: shouldShowDriverBackBtn });
          }}
          displayedItems={displayedItems}
          slug={slug}
          currentL2s={tocData.currentL2s}
          setCurrentL1={(obj) => {
            console.log('obj in setCurrentL1 for AccordionNavPanel', obj);
            dispatch({ type: UPDATE_CURRENT_L2S, currentL2s: { ...tocData.currentL1, ...obj } });
          }}
          setCurrentL2s={(obj) => {
            console.log('obj in setCurrentL2s for AccordionNavPanel', obj);
            dispatch({ type: UPDATE_CURRENT_L2S, currentL2s: { ...tocData.currentL2s, ...obj } });
          }}
          hideMobile={hideMobile}
        />
        <DoublePannedNav
          showDriverBackBtn={tocData.showDriverBackBtn}
          setShowDriverBackBtn={(shouldShowDriverBackBtn) => {
            console.log('shouldShowDriverBackBtn in setCurrentL1 for DoublePannedNav', shouldShowDriverBackBtn);
            dispatch({ type: SET_SHOW_DRIVER_BACK_BTN, showDriverBackBtn: shouldShowDriverBackBtn });
          }}
          tree={tree}
          slug={slug}
          currentL2s={tocData.currentL2s}
          setCurrentL1={(obj) => {
            console.log('obj in setCurrentL1 for DoublePannedNav', obj);
            dispatch({ type: UPDATE_CURRENT_L2S, currentL2s: { ...tocData.currentL1, ...obj } });
          }}
          setCurrentL2s={(obj) => {
            console.log('obj in setCurrentL2s for DoublePannedNav', obj);
            dispatch({ type: UPDATE_CURRENT_L2S, currentL2s: { ...tocData.currentL2s, ...obj } });
          }}
          currentL1={tocData.currentL1}
        />
      </div>
    </>
  );
}
