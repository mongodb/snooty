import React from 'react';
import PropTypes from 'prop-types';

const Figure = ({ nodeData }) => (
  <img
    src={`${process.env.GATSBY_PREFIX}${nodeData.argument[0].value}`}
    alt={nodeData.options.alt ? nodeData.options.alt : nodeData.argument[0].value}
    width="50%"
  />
);

Figure.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    options: PropTypes.shape({
      alt: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Figure;
