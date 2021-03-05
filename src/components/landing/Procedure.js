import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const Procedure = ({ nodeData: { children }, ...rest }) => {
  return (
    <>
      {children.map((child, i) => (
        <ComponentFactory {...rest} nodeData={child} key={i} />
      ))}
    </>
  );
};

Procedure.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Procedure;
