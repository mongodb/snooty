import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { theme } from '../../theme/docsTheme';
import { AVAILABLE_LANGUAGES, getCurrLocale, onSelectLocale } from '../../utils/locale';

const StyledHeaderContainer = styled.header(
  (props) => `
  grid-area: header;
  top: 0;
  z-index: ${theme.zIndexes.header};
  ${props.template === 'landing' ? '' : 'position: sticky;'}
  `
);

const Header = ({ sidenav, eol, template }) => {
  const unifiedNavProperty = 'DOCS';

  const enabledLocales = AVAILABLE_LANGUAGES.map((language) => language.localeCode);
  return (
    <StyledHeaderContainer template={template}>
      <SiteBanner />
      <>
        {!eol && (
          <UnifiedNav
            fullWidth="true"
            position="relative"
            property={{ name: unifiedNavProperty }}
            showLanguageSelector={true}
            onSelectLocale={onSelectLocale}
            locale={getCurrLocale()}
            enabledLocales={enabledLocales}
          />
        )}
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
