import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

export default class Section extends Component {
  render() {
    const { nodeData } = this.props;
    return nodeData.children.map((child, index) => <ComponentFactory {...this.props} nodeData={child} key={index} />);
  }
}

Section.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};
