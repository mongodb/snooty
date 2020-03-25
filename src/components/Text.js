import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ nodeData: { value } }) => {
  return <React.Fragment>{value}</React.Fragment>;
};

Text.propTypes = {
  nodeData: PropTypes.shape({
    type: PropTypes.string.isRequired,
    value: PropTypes.string,
  }).isRequired,
};

export default Text;
