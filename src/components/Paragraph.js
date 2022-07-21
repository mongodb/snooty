import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { Body } from '@leafygreen-ui/typography';

const SKIP_P_TAGS = new Set(['caption', 'footnote', 'field']);

const Paragraph = ({ nodeData, parentNode, skipPTag, ...rest }) => {
  // For paragraph nodes that appear inside certain containers, skip <p> tags and just render their contents
  if (skipPTag || SKIP_P_TAGS.has(parentNode)) {
    return nodeData.children.map((element, index) => <ComponentFactory {...rest} nodeData={element} key={index} />);
  }
  return (
    <Body>
      {nodeData.children.map((element, index) => (
        <ComponentFactory {...rest} nodeData={element} key={index} />
      ))}
    </Body>
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
  skipPTag: PropTypes.bool,
};

Paragraph.defaultProps = {
  parentNode: undefined,
};

export default Paragraph;
