import React from 'react';
import PropTypes from 'prop-types';

const RoleIcon = ({ nodeData: { target, name } }) => {
  if ((name === 'icon') | (name === 'icon-fa5')) {
    return <i className={`fa-${target} fas`}></i>;
  } else if (name === 'icon-fa4') {
    return <i className={`fa4-${target} fa4`}></i>;
  } else if (name === 'icon-charts') {
    return <i className={`charts-icon-${target} charts-icon`}></i>;
  } else if (name === 'icon-mms') {
    return <i className={`mms-icon-${target} mms-icon`}></i>;
  }
};

RoleIcon.propTypes = {
  nodeData: PropTypes.shape({
    target: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleIcon;
