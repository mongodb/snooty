import React, { useCallback, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { uiColors } from '@leafygreen-ui/palette';
import { SidenavContext } from './sidenav-context';
import { displayNone } from '../utils/display-none';

// This container prevents the leafygreen components from flashing when the media query is true
const MenuButtonContainer = styled('div')`
  ${displayNone.onLargerThanMobile}
`;

const MenuButton = styled(IconButton)`
  :focus {
    color: ${uiColors.gray.dark3};
  }

  :before {
    display: none;
  }
`;

const SidebarMobileMenuButton = ({ className }) => {
  const { isCollapsed, setCollapsed } = useContext(SidenavContext);
  const [glyph, setGlyph] = useState('Menu');

  const clickMenu = useCallback(() => {
    setCollapsed((state) => !state);
  }, [setCollapsed]);

  useEffect(() => {
    setGlyph(isCollapsed ? 'Menu' : 'X');
  }, [isCollapsed]);

  return (
    <MenuButtonContainer className={className}>
      <MenuButton aria-label="View sidenav" onClick={clickMenu}>
        <Icon glyph={glyph} size="large" />
      </MenuButton>
    </MenuButtonContainer>
  );
};

SidebarMobileMenuButton.propTypes = {
  className: PropTypes.string,
};

export default SidebarMobileMenuButton;
