import React, { useCallback, useContext, useRef, useState } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import Box from '@leafygreen-ui/box';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { Menu, MenuItem } from '@leafygreen-ui/menu';
import { DarkModeContext } from '../../context/dark-mode-context';
import { theme } from '../../theme/docsTheme';
import IconDarkmode from '../icons/Computer';
import DarkModeGuideCue from './DarkModeGuideCue';

const iconStyling = css`
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

const DROPDOWN_ICON_SIZE = 20;
const darkModeSvgStyle = {
  width: DROPDOWN_ICON_SIZE,
  height: DROPDOWN_ICON_SIZE,
};

const DarkModeDropdown = () => {
  const darkRef = useRef();

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
      <div ref={darkRef}>
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
            <IconButton
              as={Box}
              className={cx(iconStyling)}
              aria-label="Dark Mode Menu"
              aria-labelledby="Dark Mode Menu"
            >
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
            glyph={<Icon size={DROPDOWN_ICON_SIZE} glyph={'Sun'} />}
          >
            Light
          </MenuItem>
          <MenuItem
            active={darkModePref === 'dark-theme'}
            onClick={() => select('dark-theme')}
            glyph={<Icon size={DROPDOWN_ICON_SIZE} glyph={'Moon'} />}
          >
            Dark
          </MenuItem>
          <MenuItem
            active={darkModePref === 'system'}
            onClick={() => select('system')}
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
          >
            System
          </MenuItem>
        </Menu>
      </div>
      <DarkModeGuideCue darkRef={darkRef} />
    </>
  );
};

DarkModeDropdown.propTypes = {};

export default DarkModeDropdown;
