import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';

const StyledHeaderContainer = styled.header`
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const StyledNavPlaceholder = styled.nav`
  width: 100%;
  height: 88px;
  border-bottom: 1px solid #21313c;
  background-color: white;
`;

const Header = ({ sidenav }) => {
  console.log('hello na=nav header');
  return (
    <StyledHeaderContainer>
      <SiteBanner />
      <>
        <StyledNavPlaceholder />
        {sidenav && <SidenavMobileMenuDropdown />}
      </>
    </StyledHeaderContainer>
  );
};

Header.propTypes = {
  sidenav: PropTypes.bool,
  eol: PropTypes.bool.isRequired,
};

export default Header;
