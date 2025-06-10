import React from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

const guiLabelStyle = css`
  font-style: normal;
  font-weight: 700;
`;

const RoleGUILabel = ({ nodeData: { children } }: { nodeData: ParentNode }) => (
  // Keep "guilabel" className for styling when this component is inside of a Heading.
  <span className={cx('guilabel', guiLabelStyle)}>
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </span>
);

export default RoleGUILabel;
