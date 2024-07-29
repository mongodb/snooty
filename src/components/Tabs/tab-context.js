/**
 * Context that contains language selector tab data
 * Stores which tab is currently active by reading local storage
 * or by setting default values, and allows
 * child components to read and update
 */

import React, { useEffect, useReducer, useRef } from 'react';
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

const reducer = (prevState, newState) => {
  return {
    ...prevState,
    ...newState,
  };
};

const initActiveTabs = (choicesPerSelector) => {
  // setting active tabs on server side
  // since SSG expects same result for server and client,
  // handle reading local storage in a separate useEffect
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

  return defaultRes;
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

  const initLoaded = useRef(false);

  useEffect(() => {
    // dont update local value on initial load
    if (!initLoaded.current) return;
    setLocalValue('activeTabs', activeTabs);
  }, [activeTabs]);

  useEffect(() => {
    if (!isBrowser) return;
    // get local active tabs and set as active tabs
    // if they exist on page.
    // otherwise, defaults will take precedence
    const localActiveTabs = getLocalValue('activeTabs') || {};

    const activeTabsRes = Object.keys(localActiveTabs).reduce((res, activeTabKey) => {
      if (
        activeTabKey === 'drivers' &&
        selectors?.[activeTabKey] &&
        !selectors?.[activeTabKey][localActiveTabs[activeTabKey]]
      ) {
        return res;
      }
      if (typeof localActiveTabs[activeTabKey] === 'string') {
        res[activeTabKey] = localActiveTabs[activeTabKey];
      }
      return res;
    }, {});

    setActiveTab({ ...activeTabsRes });
    initLoaded.current = true;
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
