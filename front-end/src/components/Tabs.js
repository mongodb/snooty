import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    const { nodeData, addTabset } = this.props;
    const createdTabset = addTabset([...nodeData.children]);
    const tabsetValues = createdTabset.map(element => element[0]);
    this.renderedTabset = tabsetValues.includes('windows') ? 'activeOSTab' : 'activeLanguage';
  }

  render() {
    const { nodeData, activeOSTab, activeLanguage } = this.props;
    // TODO: make more robust and allow for more tab types
    const tabsetType = activeOSTab && this.renderedTabset === 'activeOSTab' ? activeOSTab : activeLanguage;
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
  activeLanguage: PropTypes.arrayOf(PropTypes.string),
  activeOSTab: PropTypes.arrayOf(PropTypes.string),
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
