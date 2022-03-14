import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { isBrowser } from '../utils/is-browser';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from './Sidenav';
import SiteBanner from './Banner/SiteBanner';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { deprecated } from '../layouts/index';
import { isDotCom, DOTCOM_BASE_URL } from '../utils/dotcom';

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

  const docsBaseUrl = isDotCom() ? `https://${DOTCOM_BASE_URL}` : null;

  return (
    <StyledHeaderContainer>
      <SiteBanner />
      <>
        {!deprecated && <UnifiedNav position="relative" property={{ name: unifiedNavProperty }} docsBaseUrl={docsBaseUrl} />}
        {sidenav && <SidenavMobileMenuDropdown />}
      </>
    </StyledHeaderContainer>
  );
};

Header.propTypes = {
  sidenav: PropTypes.bool,
};

export default Header;
