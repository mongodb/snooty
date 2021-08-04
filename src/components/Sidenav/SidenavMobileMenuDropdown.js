import React, { useCallback, useContext } from 'react';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import { SidenavContext } from './sidenav-context';
import { theme } from '../../theme/docsTheme';
import { displayNone } from '../../utils/display-none';

const Container = styled('div')`
  align-items: center;
  background-color: ${uiColors.gray.light3};
  border-bottom: 1px solid ${uiColors.gray.light2};
  display: flex;
  height: 52px;
  justify-content: space-between;
  width: 100vw;

  ${displayNone.onLargerThanMobile}
`;

const Text = styled('div')`
  color: ${uiColors.black};
  margin-left: ${theme.size.large};
`;

const StyledIcon = styled(Icon)`
  margin-right: ${theme.size.medium};
`;

const SidenavMobileMenuDropdown = () => {
  const { hideMobile, setHideMobile } = useContext(SidenavContext);

  const clickDropdown = useCallback(() => {
    setHideMobile((state) => !state);
  }, [setHideMobile]);

  return (
    <Container onClick={clickDropdown}>
      <Text>Docs Menu</Text>
      <StyledIcon glyph={hideMobile ? 'ChevronDown' : 'ChevronUp'} />
    </Container>
  );
};

export default SidenavMobileMenuDropdown;
