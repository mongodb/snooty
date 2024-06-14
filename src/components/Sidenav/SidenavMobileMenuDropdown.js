import React, { useCallback, useContext } from 'react';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import { displayNone } from '../../utils/display-none';
import { SidenavContext } from './sidenav-context';

const Container = styled('div')`
  align-items: center;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-bottom-color);
  display: flex;
  height: ${theme.header.docsMobileMenuHeight};
  justify-content: space-between;
  width: 100vw;

  ${displayNone.onLargerThanTablet}
`;

const Text = styled('div')`
  color: var(--color);
  margin-left: ${theme.size.large};
`;

const StyledIcon = styled(Icon)`
  margin-right: ${theme.size.medium};
`;

const SidenavMobileMenuDropdown = () => {
  const { hideMobile, setHideMobile } = useContext(SidenavContext);
  const { darkMode } = useDarkMode();

  const clickDropdown = useCallback(() => {
    setHideMobile((state) => !state);
  }, [setHideMobile]);

  return (
    <Container
      onClick={clickDropdown}
      style={{
        '--background-color': darkMode ? palette.black : palette.gray.light3,
        '--border-bottom-color': darkMode ? palette.gray.dark2 : palette.gray.light2,
      }}
    >
      <Text style={{ '--color': darkMode ? palette.gray.light2 : palette.black }}>Docs Menu</Text>
      <StyledIcon glyph={hideMobile ? 'ChevronDown' : 'ChevronUp'} />
    </Container>
  );
};

export default SidenavMobileMenuDropdown;
