import React, { useCallback, useContext, useMemo, useEffect } from 'react';
import { navigate } from 'gatsby';
import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';
import Box from '@leafygreen-ui/box';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import { useViewportSize } from '@leafygreen-ui/hooks';
import Icon from '@leafygreen-ui/icon';
import { SideNav as LeafygreenSideNav, SideNavItem } from '@leafygreen-ui/side-nav';
import { palette } from '@leafygreen-ui/palette';
import { useLocation } from '@gatsbyjs/reach-router';
import ChapterNumberLabel from '../Chapters/ChapterNumberLabel';
import VersionDropdown from '../VersionDropdown';
import useStickyTopValues, { StickyTopValues } from '../../hooks/useStickyTopValues';
import { theme } from '../../theme/docsTheme';
import { formatText } from '../../utils/format-text';
import { TocContext } from '../../context/toc-context';
import { VersionContext } from '../../context/version-context';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import useViewport from '../../hooks/useViewport';
import { HeaderContext } from '../Header/header-context';
import { SIDE_NAV_CONTAINER_ID } from '../../constants';
import { DownloadButton } from '../OfflineDownloadModal';
import { useOfflineDownloadContext } from '../OfflineDownloadModal/DownloadContext';
import { reportAnalytics } from '../../utils/report-analytics';
import { displayNone } from '../../utils/display-none';
import useScreenSize from '../../hooks/useScreenSize';
import GuidesLandingTree from './GuidesLandingTree';
import GuidesTOCTree from './GuidesTOCTree';
import IA from './IA';
import IATransition from './IATransition';
import ProductsList from './ProductsList';
import { SidenavContext } from './sidenav-context';
import SidenavMobileTransition from './SidenavMobileTransition';
import Toctree from './Toctree';
import { sideNavItemBasePadding, sideNavItemFontSize, titleStyle } from './styles/sideNavItem';
import DocsHomeButton from './DocsHomeButton';
import { PageContextRepoBranches } from '../../types/data';
import { Root } from '../../types/ast';

const SIDENAV_WIDTH = 268;

// Use LG's css here to style the component without passing props
const sideNavStyling = ({ hideMobile, isCollapsed }: { hideMobile: boolean; isCollapsed: boolean }) => LeafyCSS`
  height: 100%;

  // Mobile & Tablet nav
  @media ${theme.screenSize.upToLarge} {
    ${hideMobile && 'display: none;'}

    button[data-testid="side-nav-collapse-toggle"] {
      display: none;
    }
  }

  // Tablet and mobile position
  @media ${theme.screenSize.upToLarge} {
    position: absolute;
  }

  // Allows Spaceholder element to flex grow for AdditionalLinks
  & > div > nav > div > ul {
    display: flex;
    flex-direction: column;
    padding-top: 0px;
  }

  // Prevent icons from appearing on the collapsed side nav
  ul[aria-hidden="true"] {
    ${isCollapsed && 'display: none;'}
  }

  p {
    letter-spacing: unset;
    color: ${palette.black};
  }

`;

// Prevent content scrolling when the side nav is open on mobile and tablet screen sizes
const disableScroll = (shouldDisableScroll: boolean) => css`
  body {
    ${shouldDisableScroll && 'overflow: hidden;'}
  }
`;

const getTopAndHeight = (topValue: string) => {
  return css`
    top: max(min(calc(${topValue} - var(--scroll-y))), ${theme.header.actionBarMobileHeight});
    height: calc(100vh - max(min(calc(${topValue} - var(--scroll-y))), ${theme.header.actionBarMobileHeight}));
  `;
};

// Keep the side nav container sticky to allow LG's side nav to push content seamlessly
const SidenavContainer = styled.div(
  ({ topLarge, topMedium, topSmall }: StickyTopValues) => css`
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
      z-index: ${theme.zIndexes.actionBar - 1};
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

    [data-testid='side-nav-collapse-toggle'] {
      background-color: var(--select-button-bg-color);
      color: var(--sidenav-toggle-color);
      border-color: var(--sidenav-toggle-border-color);
    }

    a[aria-current='page'] {
      background-color: var(--sidenav-active-bg-color);
      color: var(--sidenav-active-color);

      &:before {
        background-color: var(--sidenav-active-before-color);
      }
    }
  `
);

// Allows AdditionalLinks to always be at the bottom of the SideNav
const Spaceholder = styled('div')`
  flex-grow: 1;
  min-height: ${theme.size.medium};
`;

export const Border = styled('hr')`
  border: unset;
  border-bottom: 1px solid var(--sidenav-border-bottom-color);
  margin: ${theme.size.small} 0;
  width: 100%;
`;

// Create artificial "padding" at the top of the SideNav to allow products list to transition without being seen
// by the gap in the SideNav's original padding.
const ArtificialPadding = styled('div')`
  height: 15px;
`;

// Children of this div should appear 1 z-index higher than the ProductsList component.
// This allows the products in the ProductsList to slide up/down when closing/opening the list
// without appearing inline with above text
const NavTopContainer = styled('div')`
  background-color: var(--sidenav-bg-color);
  position: relative;
  z-index: 1;
`;

const StyledChapterNumberLabel = styled(ChapterNumberLabel)`
  margin-left: ${theme.size.medium};
`;

const additionalLinks = [
  { glyph: 'Support', title: 'Contact Support', url: 'https://support.mongodb.com/welcome' },
  { glyph: 'Person', title: 'Join our community', url: 'https://www.mongodb.com/community/' },
  { glyph: 'University', title: 'Register for Courses', url: 'https://learn.mongodb.com/' },
];

export type SidenavProps = {
  // TODO: 
  chapters: {};
  guides: {};
  // TODO: Unsure
  page: Root;
  pageTitle: string;
  repoBranches: PageContextRepoBranches;
  slug: string;
  eol: boolean;
}

const Sidenav = ({ chapters, guides, page, pageTitle, repoBranches, slug, eol }: SidenavProps) => {
  const { hideMobile, isCollapsed, setCollapsed, setHideMobile } = useContext(SidenavContext);
  const { project } = useSnootyMetadata();
  const isDocsLanding = project === 'landing';
  const viewportSize = useViewportSize();
  const { isTabletOrMobile } = useScreenSize();
  const { bannerContent } = useContext(HeaderContext);
  const { setModalOpen } = useOfflineDownloadContext();
  const { pathname } = useLocation();

  // CSS top property values for sticky side nav based on header height
  const topValues = useStickyTopValues(false, true, !!bannerContent);

  let showVersions = repoBranches?.branches?.length > 1;

  const { hasEmbeddedVersionDropdown } = useContext(VersionContext);
  if (hasEmbeddedVersionDropdown) {
    showVersions = false;
  }

  // Checks if user is navigating back to the homepage on docs landing
  const [back, setBack] = React.useState(false);

  const showAllProducts = page?.options?.['nav-show-all-products'];
  const ia = page?.options?.ia;

  const template = page?.options?.template;
  const hideIaHeader = template === 'landing' || template === 'search';
  const isGuidesLanding = project === 'guides' && template === 'product-landing';
  const isGuidesTemplate = template === 'guide';

  const hideMobileSidenav = useCallback(() => {
    setHideMobile(true);
  }, [setHideMobile]);

  // close navigation panel on mobile screen, but leaves open if they click on a twisty
  useEffect(() => {
    setHideMobile(true);
  }, [pathname, setHideMobile]);

  const { activeToc } = useContext(TocContext);

  // Renders side nav content based on the current project and template.
  // The guides docs typically have a different TOC compared to other docs.
  const navContent = useMemo(() => {
    if (isGuidesLanding) {
      return <GuidesLandingTree chapters={chapters} handleClick={() => hideMobileSidenav()} />;
    } else if (isGuidesTemplate) {
      return (
        <GuidesTOCTree
          chapters={chapters}
          guides={guides}
          handleClick={() => hideMobileSidenav()}
          page={page}
          slug={slug}
        />
      );
    }

    if (!Object.keys(activeToc).length) {
      return null;
    }
    return <Toctree handleClick={() => hideMobileSidenav()} slug={slug} toctree={activeToc} />;
  }, [chapters, guides, hideMobileSidenav, isGuidesLanding, isGuidesTemplate, page, slug, activeToc]);

  const navTitle = isGuidesTemplate ? guides?.[slug]?.['chapter_name'] : formatText(activeToc.title);

  const guidesChapterNumber = useMemo(() => {
    if (!isGuidesTemplate) {
      return 0;
    }

    const chapterName = guides?.[slug]?.['chapter_name'];
    return chapters[chapterName]?.['chapter_number'];
  }, [chapters, guides, isGuidesTemplate, slug]);

  // listen for scrolls for mobile and tablet menu
  const viewport = useViewport(false);

  return (
    <>
      <Global
        styles={css`
          ${disableScroll(!hideMobile)}
        `}
      />
      <SidenavContainer
        {...topValues}
        template={template}
        style={{ '--scroll-y': `${viewport.scrollY}px` }}
        id={SIDE_NAV_CONTAINER_ID}
      >
        <SidenavMobileTransition hideMobile={hideMobile} isMobile={isTabletOrMobile}>
          <LeafygreenSideNav
            aria-label="Side navigation"
            className={cx(sideNavStyling({ hideMobile, isCollapsed }))}
            collapsed={isCollapsed}
            setCollapsed={setCollapsed}
            widthOverride={isTabletOrMobile ? viewportSize?.width : SIDENAV_WIDTH}
          >
            <IATransition back={back} hasIA={!!ia} slug={slug}>
              <NavTopContainer>
                <ArtificialPadding />
                <DocsHomeButton />
                <Border />
                {ia && (
                  <IA
                    header={!hideIaHeader ? <span className={cx([titleStyle])}>{formatText(pageTitle)}</span> : null}
                    handleClick={() => {
                      setBack(false);
                      hideMobileSidenav();
                    }}
                    ia={ia}
                  />
                )}
                {showAllProducts && (
                  <Border
                    className={css`
                      margin-bottom: 0;
                    `}
                  />
                )}
              </NavTopContainer>
              {showAllProducts && <ProductsList />}
            </IATransition>

            {!ia && !showAllProducts && (
              <>
                {isGuidesTemplate && <StyledChapterNumberLabel number={guidesChapterNumber} />}
                <SideNavItem
                  as={Box}
                  className={cx(titleStyle, sideNavItemBasePadding)}
                  onClick={() => {
                    navigate(isGuidesTemplate ? slug : activeToc.url || activeToc.slug || '/');
                  }}
                >
                  <span>{navTitle}</span>
                  {process.env['GATSBY_OFFLINE_DOWNLOAD_UI'] === 'true' && process.env['OFFLINE_DOCS'] !== 'true' && (
                    <DownloadButton />
                  )}
                </SideNavItem>
              </>
            )}
            {showVersions && <VersionDropdown slug={slug} repoBranches={repoBranches} eol={eol} />}
            {!ia && navContent}

            {isDocsLanding && (
              <>
                <Spaceholder />
                {/* Represents the generic links at the bottom of the side nav (e.g. "Contact Support") */}
                {additionalLinks.map(({ glyph, title, url }) => (
                  <SideNavItem
                    className={cx(sideNavItemBasePadding, sideNavItemFontSize)}
                    key={url}
                    glyph={<Icon glyph={glyph} />}
                    href={url}
                  >
                    {title}
                  </SideNavItem>
                ))}
                {process.env['GATSBY_OFFLINE_DOWNLOAD_UI'] === 'true' && (
                  <SideNavItem
                    onClick={() => {
                      reportAnalytics('Offline docs download button clicked');
                      setModalOpen(true);
                    }}
                    className={cx(
                      sideNavItemBasePadding,
                      sideNavItemFontSize,
                      LeafyCSS`${displayNone.onMobileAndTablet}`
                    )}
                    glyph={<Icon glyph={'Download'} />}
                  >
                    Download Documentation
                  </SideNavItem>
                )}
              </>
            )}
          </LeafygreenSideNav>
        </SidenavMobileTransition>
      </SidenavContainer>
    </>
  );
};

export default Sidenav;
