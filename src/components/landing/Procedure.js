import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const Procedure = ({ nodeData: { children }, ...rest }) => {
  return (
    <div className="left-column procedure">
      {children.map((child, i) => (
        <ComponentFactory {...rest} nodeData={child} stepNumber={i + 1} key={i} />
      ))}
    </div>
  );
};

Procedure.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Procedure;
