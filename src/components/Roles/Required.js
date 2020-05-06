import React from 'react';
import PropTypes from 'prop-types';

const RoleRequired = ({ nodeData: { target } }) => (
  <span className={`apiref-resource__parameter-${target === 'True' ? 'required' : 'optional'}-flag`} />
);

RoleRequired.propTypes = {
  nodeData: PropTypes.shape({
    target: PropTypes.bool.isRequired,
  }).isRequired,
};

export default RoleRequired;
