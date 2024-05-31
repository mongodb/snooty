import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { theme } from '../../theme/docsTheme';
import { getLanguageSelectorOptions } from '../../utils/locale';

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

  useEffect(() => {
    const header = document.getElementsByClassName('header-desktop-buttons');
    console.log('HEADER', header[0]);
    const navSelectors = header[0]?.querySelectorAll('ul[role=listbox]');
    console.log('NAV SELECTORs', navSelectors);
    //console.log('LANGUAG E SELECTOR', navSelectors[1]);
    // first is search Dropdown, we want second
    // if (navSelectors?.length >= 2) {
    //   console.log('NAV SELECTORS 1', navSelectors[1]);
    //   const languageDropdown = navSelectors[1];
    //   //   const listbox = getLanguageSelectorOptions(navSelectors[1]);
    //   //   navSelectors[1] = listbox;
    //   // }
    //   // i think we need separate for mobile and desktop
    //   const availableOptions = getLanguageSelectorOptions(languageDropdown);
    //   languageDropdown.innerHTML = null;
    //   availableOptions.forEach((childd) => {
    //     footerUlElement.appendChild(childd);
    //   });
    // }
  }, []);

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
