/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import { useViewportSize } from '@leafygreen-ui/hooks';
import Icon from '@leafygreen-ui/icon';
import { SideNav as LeafygreenSideNav, SideNavItem } from '@leafygreen-ui/side-nav';
import { uiColors } from '@leafygreen-ui/palette';
import GuidesLandingTree from './GuidesLandingTree';
import GuidesTOCTree from './GuidesTOCTree';
import IA from './IA';
import IATransition from './IATransition';
import Link from '../Link';
import ProductsList from './ProductsList';
import SidenavBackButton from './SidenavBackButton';
import { SidenavContext } from './sidenav-context';
import SidenavMobileTransition from './SidenavMobileTransition';
import Toctree from './Toctree';
import { sideNavItemBasePadding } from './styles/sideNavItem';
import ChapterNumberLabel from '../Chapters/ChapterNumberLabel';
import VersionDropdown from '../VersionDropdown';
import useStickyTopValues from '../../hooks/useStickyTopValues';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { theme } from '../../theme/docsTheme';
import { formatText } from '../../utils/format-text';
import { DOCS_URL } from '../../constants';

const SIDENAV_WIDTH = 268;

// Use LG's css here to style the component without passing props
const sideNavStyling = ({ hideMobile, isCollapsed }) => LeafyCSS`
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

  a,
  p {
    letter-spacing: unset;
  }

  // TODO: Remove when mongodb-docs.css is removed
  a:hover,
  a:focus {
    color: unset;
  }
`;

const titleStyle = LeafyCSS`
  color: ${uiColors.gray.dark3};
  font-size: ${theme.fontSize.default};
  font-weight: bold;
  line-height: 20px;
  text-transform: none;
  :hover {
    background-color: inherit;
  }
`;

// Prevent content scrolling when the side nav is open on mobile and tablet screen sizes
const disableScroll = (shouldDisableScroll) => css`
  body {
    ${shouldDisableScroll && 'overflow: hidden;'}
  }
`;

const getTopAndHeight = (topValue) => css`
  top: ${topValue};
  height: calc(100vh - ${topValue});
`;

// Keep the side nav container sticky to allow LG's side nav to push content seemlessly
const SidenavContainer = styled.div(
  ({ topLarge, topMedium, topSmall }) => css`
    grid-area: sidenav;
    position: sticky;
    z-index: 2;
    ${getTopAndHeight(topLarge)};

    @media ${theme.screenSize.upToLarge} {
      ${getTopAndHeight(topMedium)};
    }

    @media ${theme.screenSize.upToSmall} {
      ${getTopAndHeight(topSmall)};
    }
  `
);

// Allows AdditionalLinks to always be at the bottom of the SideNav
const Spaceholder = styled('div')`
  flex-grow: 1;
  min-height: ${theme.size.medium};
`;

const Border = styled('hr')`
  border: unset;
  border-bottom: 1px solid ${uiColors.gray.light2};
  margin: ${theme.size.small} 0;
  width: 100%;
`;

// Create artificial "padding" at the top of the SideNav to allow products list to transition without being seen
// by the gap in the SideNav's original padding.
const ArtificialPadding = styled('div')`
  height: 16px;
`;

// Children of this div should appear 1 z-index higher than the ProductsList component.
// This allows the products in the ProductsList to slide up/down when closing/opening the list
// without appearing inline with above text
const NavTopContainer = styled('div')`
  background-color: ${uiColors.gray.light3};
  position: relative;
  z-index: 1;
`;

const StyledChapterNumberLabel = styled(ChapterNumberLabel)`
  margin-left: ${theme.size.medium};
`;

const additionalLinks = [
  { glyph: 'Support', title: 'Contact Support', url: 'https://support.mongodb.com/welcome' },
  { glyph: 'Person', title: 'Join our community', url: 'https://community.mongodb.com/' },
  { glyph: 'University', title: 'Register for Courses', url: 'https://university.mongodb.com/' },
];

const Sidenav = ({ chapters, guides, page, pageTitle, repoBranches, siteTitle, slug, toctree }) => {
  const { hideMobile, isCollapsed, setCollapsed, setHideMobile } = useContext(SidenavContext);
  const { project } = useSiteMetadata();
  const isDocsLanding = project === 'landing';
  const viewportSize = useViewportSize();
  const isMobile = viewportSize?.width <= theme.breakpoints.large;

  // CSS top property values for sticky side nav based on header height
  const topValues = useStickyTopValues();
  const showVersions = repoBranches?.branches?.length > 1;

  // Checks if user is navigating back to the homepage on docs landing
  const [back, setBack] = React.useState(null);

  const showAllProducts = page?.options?.['nav-show-all-products'];
  const ia = page?.options?.ia;

  const template = page?.options?.template;
  const isGuidesLanding = project === 'guides' && template === 'product-landing';
  const isGuidesTemplate = template === 'guide';

  const hideMobileSidenav = useCallback(() => {
    setHideMobile(true);
  }, [setHideMobile]);

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
    return <Toctree handleClick={() => hideMobileSidenav()} slug={slug} toctree={toctree} />;
  }, [chapters, guides, hideMobileSidenav, isGuidesLanding, isGuidesTemplate, page, slug, toctree]);

  const navTitle = isGuidesTemplate ? guides?.[slug]?.['chapter_name'] : siteTitle;

  const guidesChapterNumber = useMemo(() => {
    if (!isGuidesTemplate) {
      return 0;
    }

    const chapterName = guides?.[slug]?.['chapter_name'];
    return chapters[chapterName]?.['chapter_number'];
  }, [chapters, guides, isGuidesTemplate, slug]);

  return (
    <>
      <Global styles={disableScroll(!hideMobile)} />
      <SidenavContainer {...topValues}>
        <SidenavMobileTransition hideMobile={hideMobile} isMobile={isMobile}>
          <LeafygreenSideNav
            aria-label="Side navigation"
            className={cx(sideNavStyling({ hideMobile, isCollapsed }))}
            collapsed={isCollapsed}
            setCollapsed={setCollapsed}
            widthOverride={isMobile ? viewportSize.width : SIDENAV_WIDTH}
          >
            <IATransition back={back} hasIA={!!ia} slug={slug} isMobile={isMobile}>
              <NavTopContainer>
                <ArtificialPadding />
                <SideNavItem className={cx(titleStyle, sideNavItemBasePadding)} as={Link} to={DOCS_URL}>
                  MongoDB Documentation
                </SideNavItem>
                <Border />
                <SidenavBackButton
                  handleClick={() => {
                    setBack(true);
                    hideMobileSidenav();
                  }}
                  project={project}
                  currentSlug={slug}
                  target={isGuidesTemplate ? '/' : ''}
                  titleOverride={isGuidesTemplate ? siteTitle : ''}
                />
                {ia && (
                  <IA
                    header={<span className={cx(titleStyle)}>{formatText(pageTitle)}</span>}
                    handleClick={() => {
                      setBack(false);
                      hideMobileSidenav();
                    }}
                    ia={ia}
                  />
                )}
                {showAllProducts && (
                  <Border
                    css={css`
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
                  className={cx(titleStyle, sideNavItemBasePadding)}
                  as={Link}
                  to={isGuidesTemplate ? slug : '/'}
                >
                  {navTitle}
                </SideNavItem>
              </>
            )}
            {showVersions && <VersionDropdown slug={slug} repoBranches={repoBranches} />}
            {!ia && navContent}

            {isDocsLanding && (
              <>
                <Spaceholder />
                {/* Represents the generic links at the bottom of the side nav (e.g. "Contact Support") */}
                {additionalLinks.map(({ glyph, title, url }) => (
                  <SideNavItem
                    className={cx(sideNavItemBasePadding)}
                    key={url}
                    glyph={<Icon glyph={glyph} />}
                    href={url}
                  >
                    {title}
                  </SideNavItem>
                ))}
              </>
            )}
          </LeafygreenSideNav>
        </SidenavMobileTransition>
      </SidenavContainer>
    </>
  );
};

Sidenav.propTypes = {
  chapters: PropTypes.object,
  guides: PropTypes.object,
  page: PropTypes.shape({
    options: PropTypes.object,
  }).isRequired,
  repoBranches: PropTypes.object,
  siteTitle: PropTypes.string,
  slug: PropTypes.string.isRequired,
};

export default Sidenav;
