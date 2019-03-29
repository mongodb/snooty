import React from 'react';
import PropTypes from 'prop-types';

const Reference = props => {
  const { nodeData } = props;
  return (
    <a className="reference external" href={nodeData.refuri}>
      {nodeData.children[0].value}
    </a>
  );
};

Reference.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default Reference;
