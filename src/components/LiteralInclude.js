import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

export default class LiteralInclude extends Component {
  constructor(props) {
    super(props);

    const { nodeData, refDocMapping } = this.props;

    let key = getNestedValue(['argument', 0, 'value'], nodeData);
    // fix for some includes
    if (key && key.startsWith('/')) {
      key = key.substr(1);
    }
    const startText = getNestedValue(['options', 'start-after'], nodeData);
    const endText = getNestedValue(['options', 'end-before'], nodeData);
    this.resolvedIncludeData = refDocMapping[key];

    this.codeExample =
      typeof this.resolvedIncludeData === 'string'
        ? this.resolvedIncludeData.substring(
            this.resolvedIncludeData.indexOf(startText) + startText.length,
            this.resolvedIncludeData.indexOf(endText)
          )
        : '';
  }

  render() {
    return (
      <ComponentFactory
        {...this.props}
        nodeData={{
          type: 'code',
          value: this.codeExample.substring(0, this.codeExample.lastIndexOf('\n')).trim(),
        }}
      />
    );
  }
}

LiteralInclude.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ),
    options: PropTypes.shape({
      'start-after': PropTypes.string.isRequired,
      'end-before': PropTypes.string.isRequired,
    }),
  }).isRequired,
  refDocMapping: PropTypes.objectOf(PropTypes.object).isRequired,
};
