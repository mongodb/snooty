import React, { Component } from 'react';
import PropTypes, { node } from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

export default class LiteralInclude extends Component {
  constructor(props) {
    super(props);

    const { nodeData, _ } = this.props;

    this.codeExample = '';

    if (nodeData.children && nodeData.children.length) {
      this.codeExample = nodeData.children[0].value;
    }
  }

  render() {
    return (
      <ComponentFactory
        {...this.props}
        nodeData={{
          type: 'code',
          value: this.codeExample,
        }}
      />
    );
  }
}

LiteralInclude.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
  }).isRequired,
  codeExample: PropTypes.string.isRequired,
};
