import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const ListItem = ({ nodeData, ...rest }) => (
  <li>
    {nodeData.children.map((child, index) => (
      <ComponentFactory
        {...rest}
        nodeData={child}
        key={index}
        // Include <p> tags in <li> if there is more than one paragraph
        skipPTag={nodeData.children.length === 1}
      />
    ))}
  </li>
);

ListItem.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default ListItem;
