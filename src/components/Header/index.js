import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import SiteBanner from '../Banner/SiteBanner';
import { theme } from '../../theme/docsTheme';
import { getAvailableLanguages, getCurrLocale, onSelectLocale } from '../../utils/locale';
import { HeaderContext } from './header-context';

const StyledHeaderContainer = styled.header(
  (props) => `
  grid-area: header;
  top: 0;
  margin-top: ${props.hasBanner ? theme.header.bannerHeight : '0px'};
  z-index: ${theme.zIndexes.header};
  `
);

const Header = ({ eol, template }) => {
  const unifiedNavProperty = 'DOCS';

  const enabledLocales = getAvailableLanguages().map((language) => language.localeCode);
  const { bannerContent } = useContext(HeaderContext);

  return (
    <>
      <SiteBanner />
      <StyledHeaderContainer template={template} hasBanner={!!bannerContent}>
        <>
          {/* Two navs used intentionally: one for light mode, one for dark mode */}
          {!eol && (
            <>
              <UnifiedNav
                fullWidth="true"
                position="relative"
                property={{ name: unifiedNavProperty }}
                showLanguageSelector={true}
                onSelectLocale={onSelectLocale}
                locale={getCurrLocale()}
                enabledLocales={enabledLocales}
                darkMode={false}
                className="nav-light"
              />
              <UnifiedNav
                fullWidth="true"
                position="relative"
                property={{ name: unifiedNavProperty }}
                showLanguageSelector={true}
                onSelectLocale={onSelectLocale}
                locale={getCurrLocale()}
                enabledLocales={enabledLocales}
                darkMode={true}
                className="nav-dark"
              />
            </>
          )}
        </>
      </StyledHeaderContainer>
    </>
  );
};

Header.propTypes = {
  eol: PropTypes.bool.isRequired,
  template: PropTypes.string.isRequired,
};

export default Header;
