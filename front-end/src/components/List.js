import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const List = props => {
  const { nodeData } = props;
  return (
    <ul>
      {nodeData.children.map((item, index) => (
        <li key={index}>
          {item.children.map((listItem, listItemIndex) => (
            <ComponentFactory {...props} nodeData={listItem} key={listItemIndex} />
          ))}
        </li>
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
