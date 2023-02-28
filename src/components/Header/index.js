import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { isBrowser } from '../../utils/is-browser';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { useMarianManifests } from '../../hooks/use-marian-manifests';

const StyledHeaderContainer = styled.header`
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Header = ({ sidenav, eol }) => {
  const { project } = useSiteMetadata();
  const { branch } = useSnootyMetadata();
  const { searchPropertyMapping } = useMarianManifests();

  let searchProperty;

  if (isBrowser) {
    const { searchParams } = new URL(window.location);
    searchProperty = searchParams.get('searchProperty');
  }
  const shouldSearchRealm = project === 'realm' || searchProperty === 'realm-master';
  const unifiedNavProperty = shouldSearchRealm ? 'REALM' : 'DOCS';

  const searchParams = [];

  let searchManifestName = project;

  /**
   * The searchPropertyMapping object will contain a new property
   * called "propertyToSearchMap". This map contains a mapping from
   * the project name to the true search manifest name in cases where the
   * project name is NOT the search manifest name.
   *
   * NOTE: The change in the fetchSearchPropertyMapping that adds this property
   * is currently in the DRAFT state, and is not included at this time.
   */
  if (project in searchPropertyMapping.projectToSearchMap) {
    searchManifestName = searchPropertyMapping.projectToSearchMap[project];
  }

  const projectManifest = `${searchManifestName}-${branch}`;

  if (projectManifest in searchPropertyMapping) {
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
