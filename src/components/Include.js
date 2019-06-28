import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';
import { getIncludeFile } from '../utils/get-include-file';

export default class Include extends Component {
  constructor(props) {
    super(props);

    const { includes, nodeData, refDocMapping, updateTotalStepCount } = this.props;

    let key = getNestedValue(['argument', 0, 'value'], nodeData);
    if (key.startsWith('/')) key = key.substr(1);
    if (key.endsWith('.rst')) key = key.replace('.rst', '');

    this.includeNodes = getNestedValue(['ast', 'children'], includes[key]) || [];

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
