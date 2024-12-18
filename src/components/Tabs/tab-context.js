/**
 * Context that contains language selector tab data
 * Stores which tab is currently active by reading local storage
 * or by setting default values, and allows
 * child components to read and update
 */

import React, { useContext, useEffect, useReducer, useRef } from 'react';
import { isEmpty } from 'lodash';
import { getLocalValue, setLocalValue } from '../../utils/browser-storage';
import { DRIVER_ICON_MAP } from '../icons/DriverIconMap';
import { ContentsContext } from '../Contents/contents-context';
import { makeChoices } from './make-choices';

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
// For drivers tabs,
// 1. return default tab if available
// 2. return 'nodejs' if found
// Otherwise, return first choice.
const getDefaultTabs = (choicesPerSelector, defaultTabs) =>
  Object.keys(choicesPerSelector || {}).reduce((res, selectorKey) => {
    const defaultTabId = defaultTabs[selectorKey] ?? 'nodejs';
    const defaultOptionIdx = choicesPerSelector[selectorKey].findIndex((tab) => tab.value === defaultTabId);
    // NOTE: default tabs should be specified here
    if (selectorKey === 'drivers' && defaultOptionIdx > -1) {
      res[selectorKey] = defaultTabId;
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

const TabProvider = ({ children, selectors = {}, defaultTabs = {} }) => {
  // init value to {} to match server and client side
  const [activeTabs, setActiveTab] = useReducer(reducer, {});
  const { setActiveSelectorIds } = useContext(ContentsContext);

  const initLoaded = useRef(false);

  useEffect(() => {
    // dont update local value on initial load
    if (!initLoaded.current) return;
    setLocalValue('activeTabs', activeTabs);

    if (isEmpty(activeTabs)) {
      return;
    }

    // on Tab update, update the active selector ids
    // so headings can be shown/hidden
    setActiveSelectorIds((activeSelectorIds) => ({ ...activeSelectorIds, tab: Object.values(activeTabs) }));
  }, [activeTabs, setActiveSelectorIds]);

  // initial effect to read from local storage
  // used in an effect to keep SSG HTML consistent
  useEffect(() => {
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
    const defaultRes = getDefaultTabs(choicesPerSelector, defaultTabs);
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
