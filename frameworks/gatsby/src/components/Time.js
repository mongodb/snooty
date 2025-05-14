import React from 'react';
import PropTypes from 'prop-types';
import { getPlaintext } from '../utils/get-plaintext';

const Time = ({ nodeData: { argument } }) => {
  const time = getPlaintext(argument);
  if (!time) {
    return null;
  }

  return (
    <p>
      <em>Time required: {time} minutes</em>
    </p>
  );
};

Time.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default Time;
