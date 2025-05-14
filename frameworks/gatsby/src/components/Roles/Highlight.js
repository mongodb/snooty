import React from 'react';
import PropTypes from 'prop-types';
import { cx, css } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';

const HIGHLIGHT_BLUE = 'highlight-blue';
const HIGHLIGHT_GREEN = 'highlight-green';
const HIGHLIGHT_RED = 'highlight-red';
const HIGHLIGHT_YELLOW = 'highlight-yellow';

const COLOR_MAP = {
  light: {
    [HIGHLIGHT_BLUE]: palette.blue.light3,
    [HIGHLIGHT_GREEN]: palette.green.light3,
    [HIGHLIGHT_RED]: palette.red.light3,
    [HIGHLIGHT_YELLOW]: palette.yellow.light3,
  },
  dark: {
    [HIGHLIGHT_BLUE]: palette.blue.dark2,
    [HIGHLIGHT_GREEN]: palette.green.dark3,
    [HIGHLIGHT_RED]: palette.red.dark3,
    [HIGHLIGHT_YELLOW]: palette.yellow.dark3,
  },
};

const Highlight = ({ nodeData: { children, name } }) => {
  const { darkMode } = useDarkMode();
  const colorTheme = darkMode ? 'dark' : 'light';
  const backgroundColor = COLOR_MAP[colorTheme][name];

  if (!backgroundColor) {
    console.warn(`Highlight color ${name} not supported.`);
  }

  return (
    <span
      className={cx(css`
        background-color: var(--background-color);
      `)}
      style={{
        '--background-color': backgroundColor,
      }}
    >
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </span>
  );
};

Highlight.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Highlight;
