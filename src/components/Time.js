import React from 'react';
import PropTypes from 'prop-types';
import { getPlaintext } from '../utils/get-plaintext';

const Time = ({ nodeData: { argument } }) => {
  return (
    <p>
      <em>Time required: {getPlaintext(argument)} minutes</em>
    </p>
  );
};

Time.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default Time;
