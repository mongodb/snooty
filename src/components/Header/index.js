import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { theme } from '../../theme/docsTheme';

const StyledHeaderContainer = styled.header(
  (props) => `
  grid-area: header;
  top: 0;
  z-index: ${theme.zIndexes.header};
  ${props.template === 'landing' || process.env['GATSBY_ENABLE_DARK_MODE'] === 'true' ? '' : 'position: sticky;'}
  `
);

const Header = ({ sidenav, eol, template }) => {
  const unifiedNavProperty = 'DOCS';

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
