import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { SideNav as LeafygreenSideNav, SideNavItem } from '@leafygreen-ui/side-nav';
import { uiColors } from '@leafygreen-ui/palette';
import IA from './IA';
import IATransition from './IATransition';
import ProductsList from './ProductsList';
import SidebarBack from './SidebarBack';
import Toctree from './Toctree';
import VersionDropdown from './VersionDropdown';
import { theme } from '../theme/docsTheme';
import { formatText } from '../utils/format-text';
import Link from './Link';

const StyledLeafygreenSideNav = styled(LeafygreenSideNav)`
  grid-area: sidebar;
  z-index: 1;

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
  a:hover,
  a:focus {
    color: unset;
  }
`;

const titleStyle = css`
  color: ${uiColors.gray.dark3};
  font-size: ${theme.fontSize.default};
  font-weight: bold;
  line-height: 20px;
  text-transform: capitalize;
  :hover {
    background-color: inherit;
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

const SiteTitle = styled(SideNavItem)`
  ${titleStyle}
`;

// Create artificial "padding" at the top of the SideNav to allow products list to transition without being seen
// by the gap in the SideNav's original padding.
const ArtificialPadding = styled('div')`
  height: 16px;
`;

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

const Sidenav = ({ page, pageTitle, publishedBranches, siteTitle, slug, toctree }) => {
  const showAllProducts = page?.options?.['nav-show-all-products'];
  const ia = page?.options?.ia;
  const [back, setBack] = React.useState(null);

  return (
    <StyledLeafygreenSideNav aria-label="Side navigation" widthOverride={268}>
      <IATransition back={back} hasIA={!!ia} slug={slug}>
        <NavTopContainer>
          <ArtificialPadding />
          <SidebarBack
            border={<Border />}
            handleClick={() => {
              setBack(true);
            }}
            slug={slug}
          />
          {ia && (
            <IA
              header={<span css={titleStyle}>{formatText(pageTitle)}</span>}
              handleClick={() => {
                setBack(false);
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
        <SiteTitle as={Link} to="/">
          {siteTitle}
        </SiteTitle>
      )}
      {publishedBranches && <VersionDropdown slug={slug} publishedBranches={publishedBranches} />}
      {!ia && <Toctree slug={slug} toctree={toctree} />}

      <Spaceholder />
      {additionalLinks.map(({ glyph, title, url }) => (
        <SideNavItem key={url} glyph={<Icon glyph={glyph} />} href={url}>
          {title}
        </SideNavItem>
      ))}
    </StyledLeafygreenSideNav>
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
