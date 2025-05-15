import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { ParentNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const CTA = ({ nodeData: { children }, ...rest }: { nodeData: ParentNode }) => (
  <div
    className={cx(css`
      font-weight: bold;
    `)}
  >
    {children.map((child, i) => (
      <ComponentFactory nodeData={child} key={i} {...rest} />
    ))}
  </div>
);

export default CTA;
