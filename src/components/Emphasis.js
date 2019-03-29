import React from 'react';
import PropTypes from 'prop-types';

const Emphasis = ({ nodeData }) => <em>{nodeData.children[0].value}</em>;

Emphasis.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Emphasis;
