import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { isBrowser } from '../utils/is-browser';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from './Sidenav';
import SiteBanner from './SiteBanner';
import { useSiteMetadata } from '../hooks/use-site-metadata';

const StyledHeaderContainer = styled.header`
  grid-area: header;
  position: sticky;
  top: 0;
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
      <>
        <UnifiedNav position="relative" property={unifiedNavProperty} />
        {sidenav && <SidenavMobileMenuDropdown />}
      </>
    </StyledHeaderContainer>
  );
};

Header.propTypes = {
  sidenav: PropTypes.bool,
};

export default Header;
