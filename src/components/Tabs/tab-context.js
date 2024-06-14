/**
 * Context that contains language selector tab data
 * Stores which tab is currently active by reading local storage
 * or by setting default values, and allows
 * child components to read and update
 */

import React, { useEffect, useReducer } from 'react';
import { getLocalValue, setLocalValue } from '../../utils/browser-storage';
import { isBrowser } from '../../utils/is-browser';
import { DRIVER_ICON_MAP } from '../icons/DriverIconMap';
import { makeChoices } from './TabSelectors';

const defaultContextValue = {
  activeTabs: {},
  selectors: {},
  setActiveTab: () => {},
};

const TabContext = React.createContext(defaultContextValue);

const reducer = (prevState, { name, value }) => {
  return {
    ...prevState,
    [name]: value,
  };
};

const initActiveTabs = (choicesPerSelector, localActiveTabs) => {
  // all tabbed content is read from browser local storage
  // if there is no browser, wait for client side local storage
  // hidden content should be handled from tab components
  if (!isBrowser) {
    return {};
  }
  // get default tabs based on availability
  const defaultRes = Object.keys(choicesPerSelector || {}).reduce((res, selectorKey) => {
    const nodeOptionIdx = choicesPerSelector[selectorKey].findIndex((tab) => tab.value === 'nodejs');
    // NOTE: default tabs should be specified here
    if (selectorKey === 'drivers' && nodeOptionIdx > -1) {
      res[selectorKey] = 'nodejs';
    } else {
      res[selectorKey] = choicesPerSelector[selectorKey][0].value;
    }
    return res;
  }, {});

  // get local active tabs
  const activeTabsRes = Object.keys(localActiveTabs || {}).reduce((res, activeTabKey) => {
    if (typeof localActiveTabs[activeTabKey] === 'string') {
      res[activeTabKey] = localActiveTabs[activeTabKey];
    }
    return res;
  }, {});

  // tabs initialize with default tabs overwritten by local storage tabs
  const initialTabs = { ...defaultRes, ...activeTabsRes };
  setLocalValue('activeTabs', initialTabs);
  return initialTabs;
};

const TabProvider = ({ children, selectors = {} }) => {
  // convert selectors to tab options first here, then set init values
  // selectors are determined at build time

  const choicesPerSelector = Object.keys(selectors).reduce((res, selector) => {
    res[selector] = makeChoices({
      name: selector,
      options: selectors[selector],
      ...(selector === 'drivers' && { iconMapping: DRIVER_ICON_MAP }),
    });
    return res;
  }, {});

  const [activeTabs, setActiveTab] = useReducer(
    reducer,
    getLocalValue('activeTabs'),
    initActiveTabs.bind(null, choicesPerSelector)
  );

  useEffect(() => {
    setLocalValue('activeTabs', activeTabs);
  }, [activeTabs]);

  return (
    <TabContext.Provider
      value={{
        activeTabs,
        selectors,
        setActiveTab,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export { TabContext, TabProvider };
