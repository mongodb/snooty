import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { isBrowser } from '../../utils/is-browser';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { theme } from '../../theme/docsTheme';

const CHATBOT_ENABLED = process.env['GATSBY_SHOW_CHATBOT'] === 'true';

const StyledHeaderContainer = styled.header(
  (props) => `
  grid-area: header;
  top: 0;
  z-index: ${theme.zIndexes.header};
  ${props.template !== 'landing' || !CHATBOT_ENABLED ? 'position: sticky;' : ''}
  `
);

const Header = ({ sidenav, eol, template }) => {
  const { project } = useSnootyMetadata();

  let searchProperty;

  if (isBrowser) {
    const { searchParams } = new URL(window.location);
    searchProperty = searchParams.get('searchProperty');
  }
  const shouldSearchRealm = project === 'realm' || searchProperty === 'realm-master';
  const unifiedNavProperty = shouldSearchRealm ? 'REALM' : 'DOCS';

  return (
    <StyledHeaderContainer template={template}>
      <SiteBanner />
      <>
        {!eol && <UnifiedNav fullWidth="true" position="relative" property={{ name: unifiedNavProperty }} />}
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
