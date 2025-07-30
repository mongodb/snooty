import React from 'react';
import ComponentFactory from '../ComponentFactory';
import Link from '../Link';
import { LinkNewTabNode } from '../../types/ast';

export type LinkNewTabProps = {
  nodeData: LinkNewTabNode;
};

const LinkNewTab = ({ nodeData: { children, target } }: LinkNewTabProps) => (
  <Link to={target} openInNewTab={true}>
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </Link>
);

export default LinkNewTab;
