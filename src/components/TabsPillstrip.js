import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pills from './Pills';
import { getNestedValue } from '../utils/get-nested-value';

export default class TabsPillstrip extends Component {
  constructor(props) {
    super(props);

    const { addPillstrip, nodeData } = this.props;
    this.pillstripName = getNestedValue(['argument', 0, 'value'], nodeData);
    addPillstrip(this.pillstripName, {});
  }

  render() {
    const { pillstrips } = this.props;
    const pillNodes = getNestedValue([this.pillstripName, 'children'], pillstrips);
    const pills = pillNodes ? pillNodes.map(pill => getNestedValue(['options', 'tabid'], pill)) : [];
    return <Pills pills={pills} pillsetName={this.pillstripName} dataTabPreference={this.pillstripName} />;
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
  pillstrips: PropTypes.objectOf(PropTypes.object),
};

TabsPillstrip.defaultProps = {
  addPillstrip: () => {},
  pillstrips: {},
};
