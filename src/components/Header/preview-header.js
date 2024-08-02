import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { theme } from '../../theme/docsTheme';
import { HeaderContext } from './header-context';

const StyledHeaderContainer = styled.header(
  (props) => `
  grid-area: header;
  top: 0;
  margin-top: ${props.hasBanner ? theme.header.bannerHeight : '0px'};
  z-index: ${theme.zIndexes.header};
  ${props.template === 'landing' || props.template === 'errorpage' ? '' : 'position: sticky;'}

  --breadcrumb-color: ${palette.gray.dark1};
  .dark-theme & {
    --breadcrumb-color: ${palette.gray.light1};
  }


  nav {
    background-
  }
  `
);

const StyledUnifiedNavPlaceholder = styled.nav`
  width: 100%;
  height: ${theme.header.navbarHeight};
  display: flex;
  align-items: center;

  --background-color: white;
  --border-color: #b8c4c2;
  .dark-theme & {
    --background-color: ${palette.black};
    --border-color: ${palette.gray.dark2};
  }
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);

  @media ${theme.screenSize.upToLarge} {
    height: ${theme.header.navbarMobileHeight};
  }
`;

const StyledStagingWarning = styled.p`
  margin: 0 20px;

  @media ${theme.screenSize.upToLarge} {
    font-size: ${theme.fontSize.small};
  }
`;

const Header = ({ sidenav }) => {
  const { bannerContent } = useContext(HeaderContext);

  return (
    <StyledHeaderContainer hasBanner={!!bannerContent}>
      <SiteBanner />
      <>
        <StyledUnifiedNavPlaceholder>
          <StyledStagingWarning>This is a staging build.</StyledStagingWarning>
        </StyledUnifiedNavPlaceholder>
        {sidenav && <SidenavMobileMenuDropdown />}
      </>
    </StyledHeaderContainer>
  );
};

Header.propTypes = {
  sidenav: PropTypes.bool,
};

export default Header;
