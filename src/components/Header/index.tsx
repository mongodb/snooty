import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { css, cx } from '@leafygreen-ui/emotion';
import { UnifiedNav } from '@mdb/consistent-nav';
import SiteBanner from '../Banner/SiteBanner';
import { theme } from '../../theme/docsTheme';
import { getCurrLocale, onSelectLocale } from '../../utils/locale';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';
import { useLocale } from '../../context/locale';
import { HeaderContext } from './header-context';

interface StyledHeaderProps {
  hasBanner: boolean;
}

const StyledHeaderContainer = styled.header<StyledHeaderProps>(
  (props) => `
  grid-area: header;
  top: 0;
  margin-top: ${props.hasBanner ? theme.header.bannerHeight : '0px'};
  z-index: ${theme.zIndexes.header};

  // Targets nav dropdown for desktop nav. These properties were causing
  // UX bugs in FF and Safari (DOP-5692)
  li > div {
    max-width: unset;
    top: unset;
  }
  `
);

const offlineClass = css`
  .header-desktop-buttons {
    display: none;
  }

  button[aria-label='Open Links'] {
    display: none;
  }
`;

type HeaderProps = {
  eol: boolean;
};

const Header = ({ eol }: HeaderProps) => {
  const unifiedNavProperty = 'DOCS';
  const { enabledLocales } = useLocale();
  const locale = getCurrLocale();
  const { hasBanner } = useContext(HeaderContext);

  return (
    <>
      <SiteBanner />
      <StyledHeaderContainer hasBanner={hasBanner}>
        <>
          {/* Two navs used intentionally: one for light mode, one for dark mode */}
          {!eol && (
            <>
              <UnifiedNav
                fullWidth={true}
                hideSearch={true}
                position="relative"
                property={{ name: unifiedNavProperty, searchParams: [] }}
                showLanguageSelector={true}
                onSelectLocale={onSelectLocale}
                // @ts-ignore
                locale={locale}
                enabledLocales={enabledLocales}
                darkMode={false}
                className={cx('nav-light', isOfflineDocsBuild ? offlineClass : '')}
              />
              <UnifiedNav
                fullWidth={true}
                hideSearch={true}
                position="relative"
                property={{ name: unifiedNavProperty, searchParams: [] }}
                showLanguageSelector={true}
                onSelectLocale={onSelectLocale}
                // @ts-ignore
                locale={locale}
                enabledLocales={enabledLocales}
                darkMode={true}
                className={cx('nav-dark', isOfflineDocsBuild ? offlineClass : '')}
              />
            </>
          )}
        </>
      </StyledHeaderContainer>
    </>
  );
};

export default Header;
