import React from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

const guiLabelStyle = css`
  font-style: normal;
  font-weight: 700;
`;

export type RoleGUILabelProps = {
  nodeData: ParentNode;
};

const RoleGUILabel = ({ nodeData: { children } }: RoleGUILabelProps) => (
  // Keep "guilabel" className for styling when this component is inside of a Heading.
  <span className={cx('guilabel', guiLabelStyle)}>
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </span>
);

export default RoleGUILabel;
