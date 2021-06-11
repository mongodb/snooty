import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { InlineCode } from '@leafygreen-ui/typography';

const Literal = ({ nodeData: { children } }) => (
  <InlineCode className="literal-comp">
    {children.map((node, i) => (
      <ComponentFactory nodeData={node} key={i} />
    ))}
  </InlineCode>
);

Literal.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Literal;
