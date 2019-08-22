import React from 'react';

export const TabContext = React.createContext({
  activeTabs: undefined,
  setActiveTab: () => {},
});
