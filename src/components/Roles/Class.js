import React from 'react';
import PropTypes from 'prop-types';

const baseUrl = 'https://api.mongodb.com/python/current/api/pymongo/results.html#';
const RoleClass = ({
  nodeData: {
    label: { value },
    target,
  },
}) => (
  <a href={`${baseUrl}${target}`} className="reference external">
    <code className="xref py py-class docutils literal notranslate">
      <span className="pre">{value}</span>
    </code>
  </a>
);

RoleClass.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.shape({
      value: PropTypes.string.isRequired,
    }).isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleClass;
