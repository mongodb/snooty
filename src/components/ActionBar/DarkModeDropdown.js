import React, { useCallback, useContext, useState } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import Box from '@leafygreen-ui/box';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { Menu, MenuItem } from '@leafygreen-ui/menu';
import { DarkModeContext } from '../../context/dark-mode-context';
import { theme } from '../../theme/docsTheme';
import IconComputer from '../icons/Computer';

const iconStyling = css`
  align-content: center
  cursor: pointer;
`;

const menuStyling = css`
  width: fit-content;
  margin-top: ${theme.size.small};
`;

const DarkModeDropdown = ({ ...props }) => {
  // not using dark mode from LG/provider here to account for case of 'system' dark theme
  const { setDarkModePref, darkModePref } = useContext(DarkModeContext);
  const { darkMode } = useDarkMode();

  const [open, setOpen] = useState(false);

  const select = useCallback(
    (selectedPref) => {
      setDarkModePref(selectedPref);
      setOpen(false);
    },
    [setDarkModePref, setOpen]
  );

  return (
    <Menu
      className={cx(menuStyling)}
      usePortal={false}
      justify={'start'}
      align={'bottom'}
      open={open}
      setOpen={setOpen}
      trigger={
        // using Box here to prevent warning of Button within Button
        // since we are using usePortal=false to mitigate sticky header
        <IconButton as={Box} className={cx(iconStyling)} aria-label="Dark Mode Menu" aria-labelledby="Dark Mode Menu">
          {darkModePref === 'system' ? (
            <IconComputer darkMode={darkMode} />
          ) : (
            <Icon glyph={darkModePref === 'dark-theme' ? 'Moon' : 'Sun'} />
          )}
        </IconButton>
      }
    >
      <MenuItem
        active={darkModePref === 'light-theme'}
        onClick={() => select('light-theme')}
        glyph={<Icon glyph={'Sun'} />}
      >
        Light
      </MenuItem>
      <MenuItem
        active={darkModePref === 'dark-theme'}
        onClick={() => select('dark-theme')}
        glyph={<Icon glyph={'Moon'} />}
      >
        Dark
      </MenuItem>
      <MenuItem
        active={darkModePref === 'system'}
        onClick={() => select('system')}
        glyph={<IconComputer darkMode={darkMode} />}
      >
        System
      </MenuItem>
    </Menu>
  );
};

DarkModeDropdown.propTypes = {};

export default DarkModeDropdown;
