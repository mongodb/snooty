import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { SideNav as LeafygreenSideNav, SideNavItem } from '@leafygreen-ui/side-nav';
import ProductsList from './ProductsList';

const StyledLeafygreenSideNav = styled(LeafygreenSideNav)`
  grid-area: sidebar;
  z-index: 1;

  // Allows Spaceholder element to flex grow for AdditionalLinks
  & > div > nav > div > ul {
    display: flex;
    flex-direction: column;
  }
`;

// Allows AdditionalLinks to always be at the bottom of the SideNav
const Spaceholder = styled('div')`
  flex-grow: 1;
`;

const StyledSideNavItem = styled(SideNavItem)`
  letter-spacing: 0;

  // TODO: Remove when mongodb-docs.css is removed
  :hover {
    color: unset;
  }
`;

const additionalLinks = [
  { glyph: 'Support', title: 'Contact Support', url: 'https://support.mongodb.com/welcome' },
  { glyph: 'Person', title: 'Join our community', url: 'https://developer.mongodb.com/' },
  { glyph: 'University', title: 'Register for Courses', url: 'https://university.mongodb.com/' },
];

const Sidenav = ({ page }) => {
  const showAllProducts = page?.options?.['nav-show-all-products'];

  return (
    <StyledLeafygreenSideNav aria-label="Side navigation">
      {showAllProducts && <ProductsList />}
      <Spaceholder />
      {additionalLinks.map(({ glyph, title, url }) => (
        <StyledSideNavItem glyph={<Icon glyph={glyph} />} href={url}>
          {title}
        </StyledSideNavItem>
      ))}
    </StyledLeafygreenSideNav>
  );
};

Sidenav.propTypes = {
  page: PropTypes.shape({
    options: PropTypes.object,
  }).isRequired,
};

export default Sidenav;
