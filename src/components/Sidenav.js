import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { SideNav as LeafygreenSideNav, SideNavItem } from '@leafygreen-ui/side-nav';
import { uiColors } from '@leafygreen-ui/palette';
import IA from './IA';
import { NavigationContext } from './navigation-context.js';
import ProductsList from './ProductsList';
import SidebarBack from './SidebarBack';
import VersionDropdown from './VersionDropdown';
import { theme } from '../theme/docsTheme';
import { formatText } from '../utils/format-text';

const StyledLeafygreenSideNav = styled(LeafygreenSideNav)`
  grid-area: sidebar;
  z-index: 1;

  // Allows Spaceholder element to flex grow for AdditionalLinks
  & > div > nav > div > ul {
    display: flex;
    flex-direction: column;
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

// Allows AdditionalLinks to always be at the bottom of the SideNav
const Spaceholder = styled('div')`
  flex-grow: 1;
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

const additionalLinks = [
  { glyph: 'Support', title: 'Contact Support', url: 'https://support.mongodb.com/welcome' },
  { glyph: 'Person', title: 'Join our community', url: 'https://developer.mongodb.com/' },
  { glyph: 'University', title: 'Register for Courses', url: 'https://university.mongodb.com/' },
];

const Sidenav = ({ page, publishedBranches, siteTitle, slug }) => {
  const showAllProducts = page?.options?.['nav-show-all-products'];
  const ia = page?.options?.ia;
  const { pageTitle } = useContext(NavigationContext);

  return (
    <StyledLeafygreenSideNav aria-label="Side navigation">
      <SidebarBack border={<Border />} slug={slug} />
      {!ia && <SiteTitle>{siteTitle}</SiteTitle>}
      {publishedBranches && <VersionDropdown publishedBranches={publishedBranches} />}
      {ia && <IA header={<span css={titleStyle}>{formatText(pageTitle)}</span>} ia={ia} />}
      {showAllProducts && <ProductsList />}
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
