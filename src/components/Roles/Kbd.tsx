import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { InlineKeyCode } from '@leafygreen-ui/typography';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

export type KbdProps = {
  nodeData: ParentNode;
};

const darkModeOverwriteStyling = css`
  color: var(--font-color-primary);
  background-color: var(--background-color-primary);
`;

const Kbd = ({ nodeData: { children } }: KbdProps) => (
  <InlineKeyCode className={cx(darkModeOverwriteStyling)}>
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </InlineKeyCode>
);

export default Kbd;
