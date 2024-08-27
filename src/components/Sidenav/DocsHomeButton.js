import React, { useMemo } from 'react';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import Icon from '@leafygreen-ui/icon';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { MongoDBLogoMark } from '@leafygreen-ui/logo';
import { Body, Link } from '@leafygreen-ui/typography';
import { palette } from '@leafygreen-ui/palette';
import useViewport from '../../hooks/useViewport';
import { baseUrl } from '../../utils/base-url';
import { theme } from '../../theme/docsTheme';
import useScreenSize from '../../hooks/useScreenSize';
import { sideNavItemBasePadding } from './styles/sideNavItem';
import { titleStyle, logoLinkStyling } from './styles/sideNavItem';

const homeLinkStyle = LeafyCSS`
  span {
    color: var(--tab-color-primary);
    font-weight: 400;
    display: flex;
    gap: 6px;
    svg {
      height: 17px;
    }
  }
`;

const containerStyle = LeafyCSS`
  display: flex;
  align-items: center;
`;

const logoTextStyling = LeafyCSS`
  line-height: ${theme.fontSize.h1};
  font-weight: 600;
  font-size: ${theme.fontSize.small};
  .dark-theme & {
    color: ${palette.white};
  }
`;

const DocsHomeButton = () => {
  const viewport = useViewport(false);
  const { isMobile } = useScreenSize();
  const { darkMode } = useDarkMode();

  const sideNavHome = useMemo(
    () => (
      <SideNavItem
        className={cx(titleStyle, sideNavItemBasePadding, homeLinkStyle)}
        as={Link}
        href={baseUrl()}
        hideExternalIcon={true}
      >
        <Icon glyph="Home"></Icon>
        Docs Home
      </SideNavItem>
    ),
    []
  );

  const homeNav = useMemo(
    () => (
      <a className={cx(logoLinkStyling)} href="https://mongodb.com/docs">
        <MongoDBLogoMark height={34} color={darkMode ? 'white' : 'black'}></MongoDBLogoMark>
        <Body className={cx(logoTextStyling)}>MongoDB Docs</Body>
      </a>
    ),
    [darkMode]
  );
  return (
    <div className={cx(containerStyle)}>
      {!isMobile && viewport.scrollY > parseInt(theme.header.navbarHeight, 10) ? homeNav : sideNavHome}
    </div>
  );
};

DocsHomeButton.propTypes = {};

export default DocsHomeButton;
