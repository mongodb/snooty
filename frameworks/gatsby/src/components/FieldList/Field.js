import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';

const Field = ({ nodeData: { children, label, name }, ...rest }) => (
  <tr
    css={css`
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

Field.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Field;
