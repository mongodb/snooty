import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { theme } from '../../theme/docsTheme';
import { AVAILABLE_LANGUAGES, getCurrLocale, onSelectLocale } from '../../utils/locale';
import { HeaderContext } from './header-context';

const StyledHeaderContainer = styled.header(
  (props) => `
  grid-area: header;
  top: 0;
  margin-top: ${props.hasBanner ? theme.header.bannerHeight : '0px'};
  z-index: ${theme.zIndexes.header};
  ${props.template === 'landing' || props.template === 'errorpage' ? '' : 'position: sticky;'}
  `
);

const Header = ({ sidenav, eol, template }) => {
  const unifiedNavProperty = 'DOCS';

  const enabledLocales = AVAILABLE_LANGUAGES.map((language) => language.localeCode);
  const { bannerContent } = useContext(HeaderContext);

  return (
    <>
      <SiteBanner />
      <StyledHeaderContainer template={template} hasBanner={!!bannerContent}>
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
    </>
  );
};

Header.propTypes = {
  sidenav: PropTypes.bool,
  eol: PropTypes.bool.isRequired,
};

export default Header;
