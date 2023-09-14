import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { isBrowser } from '../../utils/is-browser';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { useMarianManifests } from '../../hooks/use-marian-manifests';

const CHATBOT_ENABLED = process.env['GATSBY_SHOW_CHATBOT'] === 'true';

const StyledHeaderContainer = styled.header(
  (props) => `
  grid-area: header;
  top: 0;
  z-index: 1000;
  ${props.template !== 'landing' || !CHATBOT_ENABLED ? 'position: sticky;' : ''}
  `
);

const Header = ({ sidenav, eol, template }) => {
  const { project, branch } = useSnootyMetadata();
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
   * called "projectToSearchMap". This map contains a mapping from
   * the project name to the true search manifest name in cases where the
   * project name is NOT the search manifest name.
   */
  if (searchPropertyMapping.projectToSearchMap && project in searchPropertyMapping.projectToSearchMap) {
    searchManifestName = searchPropertyMapping.projectToSearchMap[project];
  }

  const projectManifest = `${searchManifestName}-${branch}`;

  if (projectManifest in searchPropertyMapping) {
    searchParams.push({ param: 'searchProperty', value: projectManifest });
  }

  return (
    <StyledHeaderContainer template={template}>
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
