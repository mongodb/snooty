import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ nodeData: { value } }) => <React.Fragment>{value}</React.Fragment>;

Text.propTypes = {
  nodeData: PropTypes.shape({
    value: PropTypes.string.isRequired,
  }).isRequired,
};

export default Text;
