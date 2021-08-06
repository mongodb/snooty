import React from 'react';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import Navbar from './Navbar';
import { SidenavMobileMenuDropdown } from './Sidenav';
import SiteBanner from './SiteBanner';

const StyledHeaderContainer = styled.header`
  grid-area: header;
  z-index: 10;
`;

const Header = () => {
  return (
    <StyledHeaderContainer>
      <SiteBanner />
      {/* TODO: Remove this flag after consistent-nav is officially released */}
      {process.env.GATSBY_FEATURE_FLAG_CONSISTENT_NAVIGATION ? (
        <>
          {/* UnifiedNav currently looks wonky on grid layout; this should be changed in a future update */}
          <UnifiedNav position="relative" />
          <SidenavMobileMenuDropdown />
        </>
      ) : (
        <Navbar />
      )}
    </StyledHeaderContainer>
  );
};

export default Header;
