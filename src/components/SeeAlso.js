import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { cx, css } from '@leafygreen-ui/emotion';
import { Body } from '@leafygreen-ui/typography';
import { getPlaintext } from '../utils/get-plaintext';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';

const indentedContainerStyle = css`
  padding-left: ${theme.size.medium};
`;

const labelStyle = css`
  font-size: ${theme.fontSize.default};
  font-weight: 600;
  margin-bottom: ${theme.size.tiny};
`;

/**
 * Checks if all child content are unordered list nodes (no extra padding required)
 * @param {object[]} children
 * @returns {boolean}
 */
const hasOnlyUnorderedLists = (children) => {
  const isListNode = (nodeData) => nodeData.type === 'list' && nodeData.enumtype === 'unordered';
  return children.every((child) => isListNode(child));
};

const SeeAlso = ({ nodeData: { argument, children }, ...rest }) => {
  const title = getPlaintext(argument);
  const onlyUnorderedLists = useMemo(() => hasOnlyUnorderedLists(children), [children]);

  return (
    <section>
      <Body className={cx(labelStyle)}>{`See also: ${title}`}</Body>
      <div className={cx(!onlyUnorderedLists && indentedContainerStyle)}>
        {children.map((child, i) => (
          <ComponentFactory {...rest} key={i} nodeData={child} />
        ))}
      </div>
    </section>
  );
};

SeeAlso.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default SeeAlso;
