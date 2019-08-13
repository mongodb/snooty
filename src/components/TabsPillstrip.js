import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pills from './Pills';
import { getNestedValue } from '../utils/get-nested-value';
import { findAllKeyValuePairs } from '../utils/find-all-key-value-pairs';

export default class TabsPillstrip extends Component {
  constructor(props) {
    super(props);

    const { addPillstrip, nodeData, refDocMapping } = this.props;
    this.pillstripName = getNestedValue(['argument', 0, 'value'], nodeData);
    addPillstrip(this.pillstripName);

    const tabsets = findAllKeyValuePairs(getNestedValue(['ast', 'children'], refDocMapping), 'name', 'tabs');
    const pillsetNode = tabsets.find(tabset => getNestedValue(['options', 'tabset'], tabset) === this.pillstripName);
    this.pillset = pillsetNode.children.map(pill => getNestedValue(['argument', 0, 'value'], pill));
  }

  render() {
    return <Pills pills={this.pillset} pillsetName={this.pillstripName} dataTabPreference={this.pillstripName} />;
  }
}

TabsPillstrip.propTypes = {
  addPillstrip: PropTypes.func,
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  refDocMapping: PropTypes.shape({
    ast: PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }).isRequired,
};

TabsPillstrip.defaultProps = {
  addPillstrip: () => {},
};
