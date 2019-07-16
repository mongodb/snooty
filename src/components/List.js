import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const List = props => {
  const { nodeData } = props;
  const ListTag = nodeData.ordered ? 'ol' : 'ul';
  return (
    <ListTag>
      {nodeData.children.map((listChild, index) => (
        <ComponentFactory {...props} nodeData={listChild} key={index} />
      ))}
    </ListTag>
  );
};

List.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
    ordered: PropTypes.bool,
  }).isRequired,
};

export default List;
