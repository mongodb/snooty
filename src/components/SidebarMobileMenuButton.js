import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import SidebarContext from './sidebar-context';
import { uiColors } from '@leafygreen-ui/palette';
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
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useContext(SidebarContext);

  const clickMenu = useCallback(() => {
    setIsMobileMenuOpen(state => !state);
  }, [setIsMobileMenuOpen]);

  return (
    <MenuButtonContainer className={className}>
      <MenuButton aria-label="View All Products" onClick={clickMenu}>
        <Icon glyph={isMobileMenuOpen ? 'X' : 'Menu'} size="large" />
      </MenuButton>
    </MenuButtonContainer>
  );
};

SidebarMobileMenuButton.propTypes = {
  className: PropTypes.string,
};

export default SidebarMobileMenuButton;
