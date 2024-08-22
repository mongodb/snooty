import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import { displayNone } from '../../utils/display-none';
import ActionBar from '../ActionBar/ActionBar';
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

const StyledLink = styled.a`
  display: flex;
  color: ${palette.black};
  text-transform: uppercase;
  margin-left: ${theme.size.large};

  .dark-theme & {
    color: ${palette.gray.light2};
  }
`;

const Text = styled('div')`
  color: var(--color);
`;

const StyledIcon = styled(Icon)``;

const SidenavMobileMenuDropdown = ({ slug, template }) => {
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
      <StyledLink>
        <StyledIcon glyph={hideMobile ? 'ChevronDown' : 'ChevronUp'} />
        <Text>Docs Menu</Text>
        <ActionBar template={template} slug={slug} />
      </StyledLink>
    </Container>
  );
};

export default SidenavMobileMenuDropdown;

SidenavMobileMenuDropdown.propTypes = {
  slug: PropTypes.bool.isRequired,
  template: PropTypes.string.isRequired,
};
