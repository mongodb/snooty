import React from 'react';
import PropTypes from 'prop-types';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import Icon from '@leafygreen-ui/icon';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import { Link } from '@leafygreen-ui/typography';
import { baseUrl } from '../../utils/base-url';
import { sideNavItemBasePadding } from './styles/sideNavItem';
import { titleStyle } from './styles/sideNavItem';

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

const DocsHomeButton = ({ darkMode }) => {
  return (
    <div className={cx(containerStyle)}>
      <SideNavItem
        className={cx(titleStyle, sideNavItemBasePadding, homeLinkStyle)}
        as={Link}
        href={baseUrl()}
        hideExternalIcon={true}
      >
        <Icon glyph="Home"></Icon>
        Docs Home
      </SideNavItem>
    </div>
  );
};

DocsHomeButton.propTypes = {
  darkMode: PropTypes.bool,
};

export default DocsHomeButton;
