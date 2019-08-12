import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const VALID_ONLY_PARAMS = ['html', '(not man)'];

const Only = ({ nodeData, ...rest }) => {
  const conditional = getNestedValue(['argument', 0, 'value'], nodeData);
  if (VALID_ONLY_PARAMS.includes(conditional)) {
    return nodeData.children.map((child, index) => <ComponentFactory {...rest} nodeData={child} key={index} />);
  }
  return null;
};

export default Only;
