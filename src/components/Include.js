import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

export default class Include extends Component {
  constructor(props) {
    super(props);

    const { nodeData, refDocMapping, updateTotalStepCount } = this.props;

    let key = nodeData.argument[0].value;
    if (key.startsWith('/')) key = key.substr(1);
    if (key.endsWith('.rst')) key = key.replace('.rst', '');
    this.resolvedIncludeData = [];
    // get document for include url
    if (refDocMapping && Object.keys(refDocMapping).length > 0) {
      this.resolvedIncludeData = refDocMapping[key].ast ? refDocMapping[key].ast.children : [];
    }
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
