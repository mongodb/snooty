import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Field = ({ nodeData: { children, label, name }, ...rest }) => (
  <tr>
    <th className="field-header">{label || name}:</th>
    <td className="field-cell">
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
