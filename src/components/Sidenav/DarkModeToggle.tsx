import React, { useContext } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { DARK_THEME_CLASSNAME, DarkModeContext, LIGHT_THEME_CLASSNAME } from '../../context/dark-mode-context';
import { theme } from '../../theme/docsTheme';

const toggleStyle = css`
  margin: 0 ${theme.size.default};
`;

const DarkModeToggle = () => {
  const { setDarkModePref } = useContext(DarkModeContext);
  const { darkMode } = useDarkMode();

  const onToggle = () => {
    setDarkModePref(darkMode ? LIGHT_THEME_CLASSNAME : DARK_THEME_CLASSNAME);
  };

  return (
    <IconButton className={cx(toggleStyle)} onClick={onToggle} aria-label="Dark Mode Toggle">
      <Icon glyph={darkMode ? 'Moon' : 'Sun'} />
    </IconButton>
  );
};

export default DarkModeToggle;
