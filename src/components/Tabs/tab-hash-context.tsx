/**
 * Context that contains awareness and control within nested tabs for hash anchors
 * Stores function to open designated tab and all parent tabs for hash anchor links
 */
import React, { ReactNode, useContext } from 'react';
import { TabContext } from './tab-context';

interface TabHashContextType {
  setActiveTabToHashTab: () => void;
}

const defaultContextValue: TabHashContextType = {
  setActiveTabToHashTab: () => {},
};

const TabHashContext = React.createContext<TabHashContextType>(defaultContextValue);

const TabHashProvider = ({
  children,
  tabName,
  tabId,
  switchToParentTab,
}: {
  children: ReactNode;
  tabName: string;
  tabId: string;
  switchToParentTab: () => void;
}) => {
  const { setActiveTab } = useContext(TabContext);

  const setActiveTabToHashTab = () => {
    switchToParentTab();
    const tabValue = { [tabName]: tabId };
    setActiveTab(tabValue);
  };

  return (
    <TabHashContext.Provider
      value={{
        setActiveTabToHashTab,
      }}
    >
      {children}
    </TabHashContext.Provider>
  );
};

export { TabHashContext, TabHashProvider };
