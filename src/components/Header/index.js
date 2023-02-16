import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { isBrowser } from '../../utils/is-browser';
import { VersionContext } from '../../context/version-context';
const StyledHeaderContainer = styled.header`
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Header = ({ sidenav, eol }) => {
  const { project } = useSiteMetadata();
  const { activeVersions } = useContext(VersionContext);

  let searchProperty;
  if (isBrowser) {
    const { searchParams } = new URL(window.location);
    searchProperty = searchParams.get('searchProperty');
  }
  const shouldSearchRealm = project === 'realm' || searchProperty === 'realm-master';
  const unifiedNavProperty = shouldSearchRealm ? 'REALM' : 'DOCS';

  const searchParams = [];

  if (project.includes('drivers')) {
    const projectManifest = `${project}-${activeVersions[project]}`;

    searchParams.push({ param: 'searchProperty', value: projectManifest });
  }

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
