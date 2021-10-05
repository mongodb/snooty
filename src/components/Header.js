import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { isBrowser } from '../utils/is-browser';
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

  let searchProperty;
  if (isBrowser) {
    searchProperty = new URL(window.location).searchParams.get('searchProperty');
  }

  const shouldSearchRealm = project === 'realm' || searchProperty === 'realm-master';
  const unifiedNavProperty = shouldSearchRealm ? 'REALM' : 'DOCS';

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
