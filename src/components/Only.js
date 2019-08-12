import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

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
