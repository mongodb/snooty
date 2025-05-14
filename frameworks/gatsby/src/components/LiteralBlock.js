import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const LiteralBlock = ({ nodeData: { children }, ...rest }) => (
  <div className="highlight-default">
    <div className="highlight">
      <pre>
        {children.map((child, index) => (
          <ComponentFactory {...rest} key={index} nodeData={child} />
        ))}
      </pre>
    </div>
  </div>
);

LiteralBlock.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default LiteralBlock;
