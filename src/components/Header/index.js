import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { isBrowser } from '../../utils/is-browser';

const StyledHeaderContainer = styled.header`
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Header = ({ sidenav, eol }) => {
  const { project } = useSiteMetadata();

  let searchProperty;
  const searchParams = [];
  if (isBrowser) {
    const { searchParams, pathname } = new URL(window.location);
    searchProperty = searchParams.get('searchProperty');

    // when splitting path name, we get empty strings, so we want to filter those out
    // we also don't want to include 'docs' or 'realm' in the searchParams
    // docs and realm are already accounted for in the searchProperty
    const paths = pathname.split('/').filter((s) => !!s && s !== 'docs' && s !== 'realm');

    paths.forEach((pathTerm) => searchParams.push({ value: pathTerm }));
  }

  const shouldSearchRealm = project === 'realm' || searchProperty === 'realm-master';
  const unifiedNavProperty = shouldSearchRealm ? 'REALM' : 'DOCS';
  return (
    <StyledHeaderContainer>
      <SiteBanner />
      <>
        {!eol && <UnifiedNav position="relative" property={{ name: unifiedNavProperty, searchParams }} />}
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
