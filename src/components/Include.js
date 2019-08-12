import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

export default class Include extends Component {
  constructor(props) {
    super(props);

    const {
      nodeData: { children },
      updateTotalStepCount,
    } = this.props;

    if (updateTotalStepCount) {
      updateTotalStepCount(children.length);
    }
  }

  render() {
    const {
      nodeData: { children },
    } = this.props;
    return children.map((includeObj, index) => (
      <ComponentFactory {...this.props} nodeData={includeObj} key={index} stepNum={index} />
    ));
  }
}

Include.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  updateTotalStepCount: PropTypes.func,
};

Include.defaultProps = {
  updateTotalStepCount: () => {},
};
