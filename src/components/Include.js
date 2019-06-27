import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const Include = ({ includes, nodeData, updateTotalStepCount, ...rest }) => {
  let key = getNestedValue(['argument', 0, 'value'], nodeData);
  if (key.startsWith('/')) key = key.substr(1);
  if (key.endsWith('.rst')) key = key.replace('.rst', '');

  const includeNodes = getNestedValue(['ast', 'children'], includes[key]) || [];
  // TODO: ask daniel if we're using this
  /* if (updateTotalStepCount) {
    updateTotalStepCount(includeNodes.length);
  } */

  return includeNodes.map((includeObj, index) => (
    <ComponentFactory {...rest} nodeData={includeObj} key={index} stepNum={index} includes={includes} />
  ));
};

Include.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  updateTotalStepCount: PropTypes.func,
};

Include.defaultProps = {
  updateTotalStepCount: () => {},
};

export default Include;
