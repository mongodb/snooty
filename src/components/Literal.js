import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { InlineCode } from '@leafygreen-ui/typography';
import ComponentFactory from './ComponentFactory';

const StyledInlineCode = styled(InlineCode)`
  /* Unset font size so it inherits it from its context */
  font-size: unset;
`;

const Literal = ({ nodeData: { children } }) => (
  <StyledInlineCode>
    {children.map((node, i) => (
      <ComponentFactory nodeData={node} key={i} />
    ))}
  </StyledInlineCode>
);

Literal.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Literal;
