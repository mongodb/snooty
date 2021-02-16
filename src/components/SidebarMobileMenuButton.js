import React, { useContext, useCallback } from 'react';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { SidebarContext } from './sidebar-context';
import { theme } from '../theme/docsTheme';
import { uiColors } from '@leafygreen-ui/palette';

// This container prevents the leafygreen components from flashing when the media query is true
const MenuButtonContainer = styled('div')`
  @media ${theme.screenSize.smallAndUp} {
    display: none;
  }
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

export default SidebarMobileMenuButton;
