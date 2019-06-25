import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Paragraph = ({ admonition, nodeData, parentNode, position, ...rest }) => {
  // For paragraph nodes that appear inside certain containers, skip <p> tags and just render their contents
  if (parentNode === 'listItem' || parentNode === 'listTable') {
    return nodeData.children.map((element, index) => <ComponentFactory {...rest} nodeData={element} key={index} />);
  }
  return (
    <p style={{ margin: admonition ? '0 0 12.5px' : '' }} className={position}>
      {nodeData.children.map((element, index) => (
        <ComponentFactory {...rest} nodeData={element} key={index} />
      ))}
    </p>
  );
};

Paragraph.propTypes = {
  admonition: PropTypes.bool,
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  parentNode: PropTypes.string,
  position: PropTypes.string,
};

Paragraph.defaultProps = {
  admonition: false,
  parentNode: undefined,
  position: '',
};

export default Paragraph;
