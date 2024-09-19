import React, { useCallback, useContext, useRef, useState } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import Box from '@leafygreen-ui/box';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { Menu, MenuItem } from '@leafygreen-ui/menu';
import { DarkModeContext } from '../../context/dark-mode-context';
import { theme } from '../../theme/docsTheme';
import IconDarkmode from '../icons/DarkMode';
import DarkModeGuideCue from './DarkModeGuideCue';

const iconStyling = css`
  display: block;
  align-content: center;
  cursor: pointer;

  > div {
    position: relative;
  }
`;

const menuStyling = css`
  width: fit-content;
  margin-top: ${theme.size.small};
`;

const menuItemStyling = css`
  tabindex: 0;
`;

const DROPDOWN_ICON_SIZE = 20;
const darkModeSvgStyle = {
  width: DROPDOWN_ICON_SIZE,
  height: DROPDOWN_ICON_SIZE,
};

const DarkModeDropdown = () => {
  const guideCueRef = useRef();

  // not using dark mode from LG/provider here to account for case of 'system' dark theme
  const { setDarkModePref, darkModePref } = useContext(DarkModeContext);

  const [open, setOpen] = useState(false);

  const select = useCallback(
    (selectedPref) => {
      setDarkModePref(selectedPref);
      setOpen(false);
    },
    [setDarkModePref, setOpen]
  );

  return (
    // Remove Fragment and div when Dark Mode Guide Cue is removed - only used for guide cue placement
    <>
      <div ref={guideCueRef}>
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
            <IconButton className={cx(iconStyling)} aria-label="Dark Mode Menu" aria-labelledby="Dark Mode Menu">
              {darkModePref === 'system' ? (
                <IconDarkmode />
              ) : (
                <Icon size={24} glyph={darkModePref === 'dark-theme' ? 'Moon' : 'Sun'} />
              )}
            </IconButton>
          }
        >
          <MenuItem
            active={darkModePref === 'light-theme'}
            onClick={() => select('light-theme')}
            onKeyDown={() => select('light-theme')}
            glyph={<Icon size={DROPDOWN_ICON_SIZE} glyph={'Sun'} />}
            as={Box}
            className={menuItemStyling}
          >
            Light
          </MenuItem>
          <MenuItem
            active={darkModePref === 'dark-theme'}
            onClick={() => select('dark-theme')}
            onKeyDown={() => select('dark-theme')}
            glyph={<Icon size={DROPDOWN_ICON_SIZE} glyph={'Moon'} />}
            as={Box}
            className={menuItemStyling}
          >
            Dark
          </MenuItem>
          <MenuItem
            active={darkModePref === 'system'}
            onClick={() => select('system')}
            onKeyDown={() => select('system')}
            glyph={
              <IconDarkmode
                className={css`
                  svg {
                    margin-right: ${theme.size.default};
                  }
                `}
                styles={darkModeSvgStyle}
              />
            }
            as={Box}
            className={menuItemStyling}
          >
            System
          </MenuItem>
        </Menu>
      </div>
      <DarkModeGuideCue guideCueRef={guideCueRef} dropdownIsOpen={open} />
    </>
  );
};

DarkModeDropdown.propTypes = {};

export default DarkModeDropdown;
