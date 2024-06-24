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
  ${props.template === 'landing' || process.env['GATSBY_ENABLE_DARK_MODE'] === 'true' ? '' : 'position: sticky;'}
  `
);

const Header = ({ sidenav, eol, template }) => {
  const unifiedNavProperty = 'DOCS';

  const enabledLocales = AVAILABLE_LANGUAGES.map((language) => language.localeCode);
  return (
    <StyledHeaderContainer template={template}>
      <SiteBanner />
      <div>
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
      </div>
    </StyledHeaderContainer>
  );
};

Header.propTypes = {
  sidenav: PropTypes.bool,
  eol: PropTypes.bool.isRequired,
};

export default Header;
