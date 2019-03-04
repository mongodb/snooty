import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    const { nodeData, addTabset } = this.props;
    addTabset(nodeData.options ? nodeData.options : { tabset: 'os' }, [...nodeData.children]);
  }

  render() {
    const { nodeData, activeOSTab, activeLanguage } = this.props;
    const tabsetType =
      nodeData.options && nodeData.options.tabset && nodeData.options.tabset === 'drivers'
        ? activeLanguage
        : activeOSTab;
    return nodeData.children.map((tab, index) => (
      <div
        key={index}
        style={{
          display: !tabsetType || tabsetType[0] === tab.argument[0].value ? 'block' : 'none',
        }}
      >
        <h3 style={{ color: 'green' }}>{tab.argument[0].value} Code</h3>
        {tab.children.length > 0 && <ComponentFactory {...this.props} nodeData={tab.children[0]} />}
      </div>
    ));
  }
}

Tabs.propTypes = {
  activeLanguage: PropTypes.string,
  activeOSTab: PropTypes.string,
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        argument: PropTypes.arrayOf(
          PropTypes.shape({
            value: PropTypes.string.isRequired,
          })
        ).isRequired,
        children: PropTypes.array,
      })
    ),
  }).isRequired,
  addTabset: PropTypes.func.isRequired,
};

Tabs.defaultProps = {
  activeLanguage: undefined,
  activeOSTab: undefined,
};
