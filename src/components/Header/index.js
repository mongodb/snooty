import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { theme } from '../../theme/docsTheme';
import { getCurrLocale, onSelectLocale } from '../../utils/locale';

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
            enabledLocales={['en-us', 'pt-br', 'ko-kr', 'zh-cn']}
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
