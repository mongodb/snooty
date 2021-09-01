import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import Navbar from './Navbar';
import { SidenavMobileMenuDropdown } from './Sidenav';
import SiteBanner from './SiteBanner';
import { useSiteMetadata } from '../hooks/use-site-metadata';

const StyledHeaderContainer = styled.header`
  grid-area: header;
  z-index: 10;
`;

const Header = ({ sidenav }) => {
  const { project } = useSiteMetadata();
  const unifiedNavProperty = project === 'realm' ? 'REALM' : 'DOCS';

  return (
    <StyledHeaderContainer>
      <SiteBanner />
      {/* TODO: Remove this flag after consistent-nav is officially released */}
      {process.env.GATSBY_FEATURE_FLAG_CONSISTENT_NAVIGATION ? (
        <>
          <UnifiedNav position="relative" property={unifiedNavProperty} />
          {sidenav && <SidenavMobileMenuDropdown />}
        </>
      ) : (
        <Navbar />
      )}
    </StyledHeaderContainer>
  );
};

Header.propTypes = {
  sidenav: PropTypes.bool,
};

export default Header;
