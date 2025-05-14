import React from 'react';
import PropTypes from 'prop-types';

const TitleReference = ({
  nodeData: {
    children: [{ value }],
  },
}) => <cite>{value}</cite>;

TitleReference.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default TitleReference;
