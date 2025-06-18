import React from 'react';
import { css } from '@leafygreen-ui/emotion';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';
import { FieldNode } from '../../types/ast';

export type FieldProps = {
  nodeData: FieldNode;
}

const Field = ({ nodeData: { children, label, name }, ...rest }: FieldProps) => (
  <tr
    className={css`
      font-size: ${theme.fontSize.default};
      > th,
      > td {
        padding: 11px 5px 12px;
        text-align: left;
      }
    `}
  >
    <th>{label || name}:</th>
    <td>
      {children.map((element, index) => (
        <ComponentFactory {...rest} nodeData={element} key={index} parentNode={index === 0 ? 'field' : undefined} />
      ))}
    </td>
  </tr>
);

export default Field;
