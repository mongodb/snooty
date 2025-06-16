import React from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import ComponentFactory from '../ComponentFactory';
import { ParentNode } from '../../types/ast';

const listParagraphStyles = css`
  ::marker {
    color: var(--font-color-primary);
  }
  & > p {
    margin-bottom: 8px;
  }
`;

export type ListItemProps = {
  nodeData: ParentNode;
};

const ListItem = ({ nodeData, ...rest }: ListItemProps) => (
  <li className={cx(listParagraphStyles)}>
    {nodeData.children.map((child, index) => (
      <ComponentFactory {...rest} nodeData={child} key={index} skipPTag={false} />
    ))}
  </li>
);

export default ListItem;
