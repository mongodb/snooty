import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const List = props => {
  const { nodeData } = props;
  return (
    <ul>
      {nodeData.children.map((listChild, index) => (
        <ComponentFactory {...props} nodeData={listChild} key={index} />
      ))}
    </ul>
  );
};

List.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default List;
