import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import ComponentFactory from '../ComponentFactory';
import { HeaderBuffer } from '../Permalink';
import { theme } from '../../theme/docsTheme';
import { findKeyValuePair } from '../../utils/find-key-value-pair';

const DefinitionListItem = ({ nodeData: { children, term }, ...rest }) => {
  const termProps = {};
  const targetIdentifier = findKeyValuePair(term, 'type', 'inline_target');

  return (
    <>
      {targetIdentifier && (
        <HeaderBuffer id={targetIdentifier.html_id} bufferSpace={`-${theme.header.navbarScrollOffset}`} />
      )}
      <dt {...termProps}>
        {term.map((child, index) => (
          <ComponentFactory nodeData={child} key={`dt-${index}`} />
        ))}
      </dt>
      <dd
        css={css`
          p:first-of-type {
            margin-top: 0 !important;
          }
        `}
      >
        {children.map((child, index) => (
          <ComponentFactory {...rest} nodeData={child} key={`dd-${index}`} skipPTag={children.length === 1} />
        ))}
      </dd>
    </>
  );
};

DefinitionListItem.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
    term: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default DefinitionListItem;
