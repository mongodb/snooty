import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

const goldStyles = css`
  color: ${palette.yellow.dark2};

  .dark-theme & {
    color: ${palette.yellow.light2};
  }
`;

const Gold = ({ nodeData: { children } }: { nodeData: ParentNode }) => (
  <strong className={cx(goldStyles)}>
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </strong>
);

export default Gold;
