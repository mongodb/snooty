import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';
import { findKeyValuePair } from '../../utils/find-key-value-pair';

const HeaderBuffer = styled.div`
  display: inline;
  margin-top: -${theme.header.navbarScrollOffset};
  position: absolute;
  // Add a bit of padding to help headings be more accurately set as "active" on FF and Safari
  padding-bottom: 2px;
`;

const DefinitionListItem = ({ nodeData: { children, term }, ...rest }) => {
  const termProps = {};
  const targetIdentifier = findKeyValuePair(term, 'type', 'inline_target');

  return (
    <>
      {targetIdentifier && <HeaderBuffer id={targetIdentifier.html_id} />}
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
