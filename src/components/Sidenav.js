import React, { useCallback, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { useViewportSize } from '@leafygreen-ui/hooks';
import Icon from '@leafygreen-ui/icon';
import { SideNav as LeafygreenSideNav, SideNavItem } from '@leafygreen-ui/side-nav';
import { uiColors } from '@leafygreen-ui/palette';
import IA from './IA';
import IATransition from './IATransition';
import ProductsList from './ProductsList';
import SidenavBackButton from './SidenavBackButton';
import { SidenavContext } from './sidenav-context';
import SidenavMobileTransition from './SidenavMobileTransition';
import VersionDropdown from './VersionDropdown';
import { theme } from '../theme/docsTheme';
import { formatText } from '../utils/format-text';
import useScreenSize from '../hooks/useScreenSize';
import { useSiteMetadata } from '../hooks/use-site-metadata';

const SIDENAV_WIDTH = 268;

const StyledLeafygreenSideNav = styled(LeafygreenSideNav)`
  height: 100%;

  // Mobile sidenav
  @media ${theme.screenSize.upToSmall} {
    ${({ hideMobile }) => hideMobile && 'display: none;'}

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

  a,
  p {
    letter-spacing: unset;
  }

  // TODO: Remove when mongodb-docs.css is removed
  a:hover {
    color: ${uiColors.gray.dark2};
  }
`;

const titleStyle = css`
  color: ${uiColors.gray.dark3};
  font-size: ${theme.fontSize.default};
  font-weight: bold;
  line-height: 20px;
  text-transform: capitalize;
`;

const ContentOverlay = styled('div')`
  background-color: ${uiColors.white};
  bottom: 0;
  left: 0;
  opacity: 0.5;
  position: absolute;
  right: 0;
  top: 0;
  width: 100vw;
  z-index: 1;
`;

const SidenavContainer = styled('div')`
  grid-area: sidenav;
  position: relative;
  z-index: 2;

  // Since we want the SideNav to open on top of the content on medium screen size,
  // keep a width as a placeholder for the collapsed SideNav while its position is absolute
  @media ${theme.screenSize.tablet} {
    width: 48px;
  }
`;

// Allows AdditionalLinks to always be at the bottom of the SideNav
const Spaceholder = styled('div')`
  flex-grow: 1;
  min-height: ${theme.size.medium};
`;

const Border = styled('hr')`
  border: unset;
  border-bottom: 1px solid ${uiColors.gray.light2};
  margin: ${theme.size.default} 0;
  width: 100%;
`;

const SiteTitle = styled('div')`
  ${titleStyle}
  margin: ${theme.size.small} ${theme.size.medium} 0 ${theme.size.medium};
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

const additionalLinks = [
  { glyph: 'Support', title: 'Contact Support', url: 'https://support.mongodb.com/welcome' },
  { glyph: 'Person', title: 'Join our community', url: 'https://developer.mongodb.com/' },
  { glyph: 'University', title: 'Register for Courses', url: 'https://university.mongodb.com/' },
];

const Sidenav = ({ page, pageTitle, publishedBranches, siteTitle, slug }) => {
  const { hideMobile, isCollapsed, setCollapsed, setHideMobile } = useContext(SidenavContext);
  const { project } = useSiteMetadata();
  const { isTablet } = useScreenSize();
  const viewportSize = useViewportSize();
  const isMobile = viewportSize?.width <= 420;

  // Checks if user is navigating back to the homepage on docs landing
  const [back, setBack] = React.useState(null);

  const showAllProducts = page?.options?.['nav-show-all-products'];
  const ia = page?.options?.ia;

  useEffect(() => {
    setCollapsed(!!isTablet);
  }, [isTablet, setCollapsed]);

  const handleOverlayClick = useCallback(() => {
    setCollapsed(true);
  }, [setCollapsed]);

  const hideMobileSidenav = useCallback(() => {
    setHideMobile(true);
  }, [setHideMobile]);

  return (
    <>
      <SidenavContainer>
        <SidenavMobileTransition hideMobile={hideMobile} isMobile={isMobile}>
          <StyledLeafygreenSideNav
            aria-label="Side navigation"
            collapsed={isCollapsed}
            hideMobile={hideMobile}
            setCollapsed={setCollapsed}
            widthOverride={isMobile ? viewportSize.width : SIDENAV_WIDTH}
          >
            <IATransition back={back} hasIA={!!ia} slug={slug} isMobile={isMobile}>
              <NavTopContainer>
                <ArtificialPadding />
                <SidenavBackButton
                  border={<Border />}
                  handleClick={() => {
                    setBack(true);
                    hideMobileSidenav();
                  }}
                  project={project}
                  currentSlug={slug}
                />
                {ia && (
                  <IA
                    header={<span css={titleStyle}>{formatText(pageTitle)}</span>}
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

            {!ia && !showAllProducts && <SiteTitle>{siteTitle}</SiteTitle>}
            {publishedBranches && <VersionDropdown slug={slug} publishedBranches={publishedBranches} />}

            <Spaceholder />
            {additionalLinks.map(({ glyph, title, url }) => (
              <SideNavItem key={url} glyph={<Icon glyph={glyph} />} href={url}>
                {title}
              </SideNavItem>
            ))}
          </StyledLeafygreenSideNav>
        </SidenavMobileTransition>
      </SidenavContainer>
      {isTablet && !isCollapsed && <ContentOverlay onClick={handleOverlayClick} />}
    </>
  );
};

Sidenav.propTypes = {
  page: PropTypes.shape({
    options: PropTypes.object,
  }).isRequired,
  publishedBranches: PropTypes.object,
  siteTitle: PropTypes.string,
  slug: PropTypes.string.isRequired,
};

export default Sidenav;
