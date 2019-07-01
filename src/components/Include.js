import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';
import { getIncludeFile } from '../utils/get-include-file';

export default class Include extends Component {
  constructor(props) {
    super(props);

    const { includes, nodeData, updateTotalStepCount } = this.props;

    const filename = getNestedValue(['argument', 0, 'value'], nodeData);
    this.includeNodes = getIncludeFile(includes, filename);

    if (updateTotalStepCount) {
      updateTotalStepCount(this.includeNodes.length);
    }
  }

  render() {
    return this.includeNodes.map((includeObj, index) => (
      <ComponentFactory {...this.props} nodeData={includeObj} key={index} stepNum={index} />
    ));
  }
}

Include.propTypes = {
  includes: PropTypes.shape({
    [PropTypes.string]: PropTypes.object,
  }).isRequired,
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
