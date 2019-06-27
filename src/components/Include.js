import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';
import { getIncludeFile } from '../utils/get-include-file';

export default class Include extends Component {
  constructor(props) {
    super(props);

    const { nodeData, refDocMapping, updateTotalStepCount } = this.props;

    const filename = getNestedValue(['argument', 0, 'value'], nodeData);
    this.resolvedIncludeData = getIncludeFile(refDocMapping, filename);

    if (updateTotalStepCount) {
      updateTotalStepCount(this.resolvedIncludeData.length);
    }
  }

  render() {
    return this.resolvedIncludeData.map((includeObj, index) => (
      <ComponentFactory {...this.props} nodeData={includeObj} key={index} stepNum={index} />
    ));
  }
}

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
