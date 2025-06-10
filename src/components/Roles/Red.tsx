import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

export type RedProps = {
  nodeData: ParentNode;
};

const redStyles = css`
  color: ${palette.red.dark2};

  .dark-theme & {
    color: ${palette.red.light1};
  }
`;

const Red = ({ nodeData: { children } }: RedProps) => (
  <strong className={cx(redStyles)}>
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </strong>
);

export default Red;
