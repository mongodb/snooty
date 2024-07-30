/**
 * Context that contains language selector tab data
 * Stores which tab is currently active by reading local storage
 * or by setting default values, and allows
 * child components to read and update
 */

import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import { getLocalValue, setLocalValue } from '../../utils/browser-storage';
import { DRIVER_ICON_MAP } from '../icons/DriverIconMap';
import { makeChoices } from './TabSelectors';

const defaultContextValue = {
  activeTabs: {},
  selectors: {},
  setActiveTab: () => {},
};

const TabContext = React.createContext(defaultContextValue);

const reducer = (prevState, newState) => {
  return {
    ...prevState,
    ...newState,
  };
};

// Helper fn to get default tabs for fallback (when no local storage found).
// If drivers tabs, return 'nodejs' if found.
// Otherwise, return first choice.
const getDefaultTabs = (choicesPerSelector) =>
  Object.keys(choicesPerSelector || {}).reduce((res, selectorKey) => {
    const nodeOptionIdx = choicesPerSelector[selectorKey].findIndex((tab) => tab.value === 'nodejs');
    // NOTE: default tabs should be specified here
    if (selectorKey === 'drivers' && nodeOptionIdx > -1) {
      res[selectorKey] = 'nodejs';
    } else {
      res[selectorKey] = choicesPerSelector[selectorKey][0].value;
    }
    return res;
  }, {});

// Helper fn to extract tab values from local storage values
// If drivers, verify this is part of selectors.
// Otherwise, return tab choice
const getLocalTabs = (localTabs, selectors) =>
  Object.keys(localTabs).reduce((res, activeTabKey) => {
    if (selectors?.[activeTabKey]?.[localTabs[activeTabKey]]) {
      res[activeTabKey] = localTabs[activeTabKey];
    }
    return res;
  }, {});

const TabProvider = ({ children, selectors = {} }) => {
  // init value to {} to match server and client side
  const [activeTabs, setActiveTab] = useReducer(reducer, {});

  // convert selectors to tab options first here, then set init values
  // selectors are determined at build time
  const choicesPerSelector = useMemo(() => {
    return Object.keys(selectors).reduce((res, selector) => {
      res[selector] = makeChoices({
        name: selector,
        options: selectors[selector],
        ...(selector === 'drivers' && { iconMapping: DRIVER_ICON_MAP }),
      });
      return res;
    }, {});
  }, [selectors]);

  const initLoaded = useRef(false);

  useEffect(() => {
    // dont update local value on initial load
    if (!initLoaded.current) return;
    setLocalValue('activeTabs', activeTabs);
  }, [activeTabs]);

  useEffect(() => {
    const defaultRes = getDefaultTabs(choicesPerSelector);
    // get local active tabs and set as active tabs
    // if they exist on page.
    // otherwise, defaults will take precedence
    const localActiveTabs = getLocalTabs(getLocalValue('activeTabs') || {}, selectors);
    initLoaded.current = true;
    setActiveTab({ ...defaultRes, ...localActiveTabs });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
