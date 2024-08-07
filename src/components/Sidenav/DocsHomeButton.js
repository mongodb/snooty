import React from 'react';
import PropTypes from 'prop-types';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import Icon from '@leafygreen-ui/icon';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { Link } from '@leafygreen-ui/typography';
import { baseUrl } from '../../utils/base-url';
import { sideNavItemBasePadding } from './styles/sideNavItem';
import { titleStyle } from './styles/sideNavItem';
import DarkModeToggle from './DarkModeToggle';

const homeLinkStyle = LeafyCSS`
  span {
    color: var(--color);
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

const DocsHomeButton = ({ darkMode }) => {
  return (
    <div className={cx(containerStyle)}>
      <SideNavItem
        className={cx(titleStyle, sideNavItemBasePadding, homeLinkStyle)}
        as={Link}
        href={baseUrl()}
        hideExternalIcon={true}
        style={{ '--color': darkMode ? palette.gray.light1 : palette.gray.dark1 }}
      >
        <Icon glyph="Home"></Icon>
        Docs Home
      </SideNavItem>
      {process.env['GATSBY_ENABLE_DARK_MODE'] === 'true' && <DarkModeToggle />}
    </div>
  );
};

DocsHomeButton.propTypes = {
  darkMode: PropTypes.bool,
};

export default DocsHomeButton;
