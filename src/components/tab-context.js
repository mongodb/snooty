import React from 'react';

export const TabContext = React.createContext({
  activeTabs: {},
  addTabset: (tabsetName, tabData) => {}, // eslint-disable-line no-unused-vars
  setActiveTab: (value, tabsetName) => {}, // eslint-disable-line no-unused-vars
});
