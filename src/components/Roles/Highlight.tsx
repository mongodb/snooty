import React from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';
import { HighlightNode, HighlightRoleNames } from '../../types/ast';

export const HIGHLIGHT_BLUE = 'highlight-blue';
export const HIGHLIGHT_GREEN = 'highlight-green';
export const HIGHLIGHT_RED = 'highlight-red';
export const HIGHLIGHT_YELLOW = 'highlight-yellow';

const COLOR_MAP: Record<'light' | 'dark', Record<HighlightRoleNames, string>> = {
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

export type HighlightProps = {
  nodeData: HighlightNode;
};

const Highlight = ({ nodeData: { children, name } }: HighlightProps) => {
  const { darkMode } = useDarkMode();
  const colorTheme = darkMode ? 'dark' : 'light';
  const backgroundColor = COLOR_MAP[colorTheme][name];

  if (!backgroundColor) {
    console.warn(`Highlight color ${name} not supported.`);
  }

  return (
    <span
      className={cx(css`
        background-color: ${backgroundColor};
      `)}
    >
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </span>
  );
};

export default Highlight;
