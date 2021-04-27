import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import { SideNav as LeafygreenSideNav } from '@leafygreen-ui/side-nav';
import Link from './Link';
import ProductsList from './ProductsList';
import { theme } from '../theme/docsTheme';

const StyledLeafygreenSideNav = styled(LeafygreenSideNav)`
  grid-area: sidebar;
  z-index: 1;

  // Allows Spaceholder element to flex grow for AdditionalLinks
  & > div > nav > div > ul {
    display: flex;
    flex-direction: column;
  }
`;

const AdditionalLink = styled(Link)`
  align-items: center;
  display: flex;
  letter-spacing: 0;
  margin-bottom: ${theme.size.default};
  padding: 0 ${theme.size.medium};
`;

const AdditionalLinksContainer = styled('div')`
  margin-top: ${theme.size.large};
`;

const LinkTitle = styled('span')`
  color: ${uiColors.gray.dark3};
  line-height: 20px;
  padding-left: ${theme.size.default};
`;

// Allows AdditionalLinks to always be at the bottom of the SideNav
const Spaceholder = styled('div')`
  flex-grow: 1;
`;

const StyledIcon = styled(Icon)`
  color: ${uiColors.black};
  height: ${theme.size.default};
  width: ${theme.size.default};
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
      <AdditionalLinksContainer>
        {additionalLinks.map(({ glyph, title, url }) => {
          return (
            <AdditionalLink to={url} key={title}>
              <StyledIcon glyph={glyph} />
              <LinkTitle>{title}</LinkTitle>
            </AdditionalLink>
          );
        })}
      </AdditionalLinksContainer>
    </StyledLeafygreenSideNav>
  );
};

Sidenav.propTypes = {
  page: PropTypes.shape({
    options: PropTypes.object,
  }).isRequired,
};

export default Sidenav;
