import React from 'react';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import Icon from '@leafygreen-ui/icon';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { Link } from '@leafygreen-ui/typography';
import { baseUrl } from '../../utils/base-url';
import { sideNavItemBasePadding } from './styles/sideNavItem';
import { titleStyle } from './styles/sideNavItem';

const homeLinkStyle = LeafyCSS`
  span {
    color: ${palette.gray.dark1};
    font-weight: 400;
    display: flex;
    gap: 6px;
    svg {
      height: 17px;
      color: ${palette.gray.dark2};
    }
  }
`;

const DocsHomeButton = () => {
  return (
    <SideNavItem
      className={cx(titleStyle, sideNavItemBasePadding, homeLinkStyle)}
      as={Link}
      href={baseUrl()}
      hideExternalIcon={true}
    >
      <Icon glyph="Home"></Icon>
      Docs Home
    </SideNavItem>
  );
};

export default DocsHomeButton;
