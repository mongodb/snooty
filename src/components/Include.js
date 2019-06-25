import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';
import { getIncludeFile } from '../utils/get-include-file';

const Include = ({ nodeData, refDocMapping, updateTotalStepCount, ...rest }) => {
  const filename = getNestedValue(['argument', 0, 'value'], nodeData);
  const resolvedIncludeData = getIncludeFile(refDocMapping, filename);
  if (updateTotalStepCount) {
    updateTotalStepCount(resolvedIncludeData.length);
  }
  return resolvedIncludeData.map((includeObj, index) => (
    <ComponentFactory {...rest} nodeData={includeObj} key={index} stepNum={index} />
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
  refDocMapping: PropTypes.shape({
    ast: PropTypes.shape({
      children: PropTypes.array,
    }),
  }),
  updateTotalStepCount: PropTypes.func,
};

Include.defaultProps = {
  updateTotalStepCount: () => {},
  refDocMapping: undefined,
};

export default Include;
