import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Field = ({ nodeData: { children, label, name }, ...rest }) => (
  <tr>
    <th>{label || name}:</th>
    <td>
      {children.map((element, index) => (
        <ComponentFactory {...rest} nodeData={element} key={index} parentNode="field" />
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
