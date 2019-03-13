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
    const { nodeData, activeOSTab, activeLanguage, activeDeployment } = this.props;
    let tabsetType;
    // if tabset options exists, then determine if pills or proper tabs
    if (nodeData.options && nodeData.options.tabset === 'drivers') {
      tabsetType = activeLanguage;
    } else if (nodeData.options && nodeData.options.tabset === 'cloud') {
      tabsetType = activeDeployment;
    } else {
      tabsetType = activeOSTab;
    }
    return nodeData.children.map((tab, index) => (
      <div
        key={index}
        style={{
          display: !tabsetType || tabsetType === tab.argument[0].value ? 'block' : 'none',
        }}
      >
        <h3 style={{ color: 'green' }}>{tab.argument[0].value} Code</h3>
        {tab.children.map((tabChild, tabChildIndex) => (
          <ComponentFactory {...this.props} nodeData={tabChild} key={tabChildIndex} />
        ))}
      </div>
    ));
  }
}

Tabs.propTypes = {
  activeLanguage: PropTypes.string,
  activeOSTab: PropTypes.string,
  activeDeployment: PropTypes.string,
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
  activeDeployment: undefined,
};
