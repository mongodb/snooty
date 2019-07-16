import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SiteMetadata from './site-metadata';
import { TabContext } from './tab-context';
import { setLocalValue } from '../utils/browser-storage';

export default class DefaultLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTabs: {},
    };
  }

  setActiveTab = (tabsetName, value) => {
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

  render() {
    const { children } = this.props;

    return (
      <TabContext.Provider value={{ ...this.state, setActiveTab: this.setActiveTab }}>
        <SiteMetadata />
        {children}
      </TabContext.Provider>
    );
  }
}

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
