import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { Body } from '@leafygreen-ui/typography';
import { appendTrailingPunctuation } from '../utils/append-trailing-punctuation';
import ComponentFactory from './ComponentFactory';
import SharedButton from './SharedButton';

const SKIP_P_TAGS = new Set(['caption', 'footnote', 'field']);

const paragraphStyling = css`
  margin-bottom: 16px;
  color: var(--font-color-primary);
`;

const Paragraph = ({ nodeData, parentNode, skipPTag, ...rest }) => {
  const children = appendTrailingPunctuation(nodeData.children);
  // For paragraph nodes that appear inside certain containers, skip <p> tags and just render their contents
  if (skipPTag || SKIP_P_TAGS.has(parentNode)) {
    return children.map((element, index) => <ComponentFactory {...rest} nodeData={element} key={index} />);
  }
  return (
    <Body className={cx(paragraphStyling)}>
      <SharedButton/>
      {children.map((element, index) => (
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
