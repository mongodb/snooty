import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { theme } from '../../theme/docsTheme';

const StyledHeaderContainer = styled.header`
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const StyledUnifiedNavPlaceholder = styled.nav`
  width: 100%;
  height: ${theme.header.navbarHeight};
  display: flex;
  align-items: center;
  border-bottom: 1px solid #b8c4c2;
  background-color: white;

  @media ${theme.screenSize.upToLarge} {
    height: ${theme.header.navbarMobileHeight};
  }
`;

const StyledStagingWarning = styled.p`
  margin: 0 20px;

  @media ${theme.screenSize.upToLarge} {
    font-size: ${theme.fontSize.small};
  }
`;

const Header = ({ sidenav }) => {
  return (
    <StyledHeaderContainer>
      <SiteBanner />
      <>
        <StyledUnifiedNavPlaceholder>
          <StyledStagingWarning>This is a staging build.</StyledStagingWarning>
        </StyledUnifiedNavPlaceholder>
        {sidenav && <SidenavMobileMenuDropdown />}
      </>
    </StyledHeaderContainer>
  );
};

Header.propTypes = {
  sidenav: PropTypes.bool,
};

export default Header;
