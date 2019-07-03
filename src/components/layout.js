import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SiteMetadata from './site-metadata';
import { TabContext } from './tab-context';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';

export default class DefaultLayout extends Component {
  constructor(props) {
    super(props);

    this.setActiveTab = (value, tabsetName) => {
      const { [tabsetName]: tabs } = this.state;
      let activeTab = value;
      if (tabs && !tabs.includes(value)) {
        activeTab = tabs[0];
      }
      this.setState(prevState => ({
        activeTabs: {
          ...prevState.activeTabs,
          [tabsetName]: activeTab,
        },
      }));
      setLocalValue(tabsetName, activeTab);
    };

    this.addTabset = (tabsetName, tabData) => {
      const tabs = tabData.map(tab => tab.argument[0].value);
      this.setActiveTab(getLocalValue(tabsetName) || tabs[0], tabsetName);
    };

    this.state = {
      activeTabs: {},
      addTabset: this.addTabset, // eslint-disable-line react/no-unused-state
      setActiveTab: this.setActiveTab, // eslint-disable-line react/no-unused-state
    };
  }

  render() {
    const { children } = this.props;

    return (
      <TabContext.Provider value={this.state}>
        <SiteMetadata />
        {children}
      </TabContext.Provider>
    );
  }
}

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
