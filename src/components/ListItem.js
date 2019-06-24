import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const ListItem = ({ nodeData, ...rest }) => (
  <li>
    {nodeData.children.map((child, index) => (
      <ComponentFactory {...rest} nodeData={child} key={index} parentNode="listItem" />
    ))}
  </li>
);

ListItem.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default ListItem;
