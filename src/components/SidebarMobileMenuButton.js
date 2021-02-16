import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { theme } from '../theme/docsTheme';
import { SidebarContext } from './sidebar-context';

const MenuButton = styled(IconButton)`
  @media ${theme.screenSize.smallAndUp} {
    display: none;
  }
`;

const SidebarMobileMenuButton = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useContext(SidebarContext);
  const onClick = () => setIsMobileMenuOpen(state => !state);

  return (
    <MenuButton onClick={onClick}>
      <Icon glyph={isMobileMenuOpen ? 'X' : 'Menu'} />
    </MenuButton>
  );
};

export default SidebarMobileMenuButton;
