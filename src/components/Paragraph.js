import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { appendTrailingPunctuation } from '../utils/append-trailing-punctuation';
import { Body } from '@leafygreen-ui/typography';
import styled from '@emotion/styled';

const SKIP_P_TAGS = new Set(['caption', 'footnote', 'field']);

const StyledParagraph = styled(Body)`
  margin-bottom: 16px;
`;

const Paragraph = ({ nodeData, parentNode, skipPTag, ...rest }) => {
  const children = appendTrailingPunctuation(nodeData.children);

  // For paragraph nodes that appear inside certain containers, skip <p> tags and just render their contents
  if (skipPTag || SKIP_P_TAGS.has(parentNode)) {
    return children.map((element, index) => <ComponentFactory {...rest} nodeData={element} key={index} />);
  }

  return (
    <StyledParagraph>
      {nodeData.children.map((element, index) => (
        <ComponentFactory {...rest} nodeData={element} key={index} />
      ))}
    </StyledParagraph>
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
