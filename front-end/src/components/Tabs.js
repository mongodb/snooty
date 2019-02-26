import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    const { changeActiveLanguage, nodeData, addTabset } = this.props;
    const createdTabset = addTabset([...nodeData.children]);
    const tabsetValues = createdTabset.map(element => element[0]);
    // TODO: make this not as lame
    this.tabsetType = 'activeLanguage';
    if (tabsetValues.includes('windows')) {
      this.tabsetType = 'activeOSTab';
    }
  }

  render() {
    const { activeLanguage, nodeData } = this.props;
    return nodeData.children.map((tab, index) => (
      <div
        key={index}
        style={{
          display:
            this.props[this.tabsetType] === undefined || this.props[this.tabsetType][0] === tab.argument[0].value
              ? 'block'
              : 'none',
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
  changeActiveLanguage: PropTypes.func.isRequired,
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
};

Tabs.defaultProps = {
  activeLanguage: undefined,
};
