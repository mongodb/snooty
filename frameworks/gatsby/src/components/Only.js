import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';
import ComponentFactory from './ComponentFactory';

// For now, explicitly define the arguments that should be accepted for Gatsby to build the node
const VALID_ONLY_ARGS = ['html', '(not man)'];

const Only = ({ nodeData, ...rest }) => {
  const argument = getNestedValue(['argument', 0, 'value'], nodeData);
  if (VALID_ONLY_ARGS.includes(argument)) {
    return nodeData.children.map((child, index) => <ComponentFactory {...rest} nodeData={child} key={index} />);
  }
  return null;
};

Only.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      }).isRequired
    ).isRequired,
  }).isRequired,
};

export default Only;
