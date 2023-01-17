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

const StyledUnifiedNavPlaceholder = styled.nav`
  width: 100%;
  height: 88px;
  border-bottom: 1px solid #b8c4c2;
  background-color: white;
`;

const Header = ({ sidenav }) => {
  return (
    <StyledHeaderContainer>
      <SiteBanner />
      <>
        <StyledUnifiedNavPlaceholder />
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
