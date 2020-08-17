import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const SKIP_P_TAGS = ['caption', 'listItem', 'listTable', 'footnote', 'definitionListItem', 'field'];

const Paragraph = ({ nodeData, parentNode, ...rest }) => {
  // For paragraph nodes that appear inside certain containers, skip <p> tags and just render their contents
  if (SKIP_P_TAGS.includes(parentNode)) {
    return nodeData.children.map((element, index) => <ComponentFactory {...rest} nodeData={element} key={index} />);
  }
  return (
    <p>
      {nodeData.children.map((element, index) => (
        <ComponentFactory {...rest} nodeData={element} key={index} />
      ))}
    </p>
  );
};

Paragraph.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  parentNode: PropTypes.string,
};

Paragraph.defaultProps = {
  parentNode: undefined,
};

export default Paragraph;
