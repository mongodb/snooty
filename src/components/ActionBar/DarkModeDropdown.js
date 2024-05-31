import React, { useContext } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { Menu, MenuItem } from '@leafygreen-ui/menu';
import { DarkModeContext } from '../../context/dark-mode-context';
import { theme } from '../../theme/docsTheme';

const IconStyling = css`
  cursor: pointer;
`;

const MenuStyling = css`
  width: fit-content;
  margin-top: ${theme.size.small};
`;

const DarkModeDropdown = ({ ...props }) => {
  // not using dark mode from LG/provider here to account for case of 'system' dark theme
  const { setDarkModePref, darkModePref } = useContext(DarkModeContext);

  return (
    <Menu
      className={cx(MenuStyling)}
      usePortal={false}
      justify={'start'}
      align={'bottom'}
      trigger={
        <IconButton className={cx(IconStyling)} aria-label="Dark Mode Menu" aria-labelledby="Dark Mode Menu">
          <Icon glyph={darkModePref === 'system' ? 'Laptop' : darkModePref === 'dark-theme' ? 'Moon' : 'Sun'} />
        </IconButton>
      }
    >
      <MenuItem
        active={darkModePref === 'light-theme'}
        onClick={() => setDarkModePref('light-theme')}
        glyph={<Icon glyph={'Sun'} />}
      >
        Light
      </MenuItem>
      <MenuItem
        active={darkModePref === 'dark-theme'}
        onClick={() => setDarkModePref('dark-theme')}
        glyph={<Icon glyph={'Moon'} />}
      >
        Dark
      </MenuItem>
      <MenuItem
        active={darkModePref === 'system'}
        onClick={() => setDarkModePref('system')}
        glyph={<Icon glyph={'Laptop'} />}
      >
        System
      </MenuItem>
    </Menu>
    // </PortalContainer>
  );
};

DarkModeDropdown.propTypes = {};

export default DarkModeDropdown;
