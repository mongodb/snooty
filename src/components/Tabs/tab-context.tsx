/**
 * Context that contains language selector tab data
 * Stores which tab is currently active by reading local storage
 * or by setting default values, and allows
 * child components to read and update
 */

import React, { ReactNode, useContext, useEffect, useReducer, useRef } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { isEmpty } from 'lodash';

import { getLocalValue, setLocalValue } from '../../utils/browser-storage';
import { DRIVER_ICON_MAP, IconComponent } from '../icons/DriverIconMap';
import { ContentsContext } from '../Contents/contents-context';
import { Node } from '../../types/ast';
import { makeChoices } from './make-choices';

type Selectors = Record<string, Record<string, Node[]>>;
type ActiveTabs = Record<string, string>;
interface Choice {
  tabSelectorIcon?: IconComponent;
  text: string;
  value: string;
}
type ChoicesPerSelector = Record<string, Choice[]>;
interface TabContextState {
  activeTabs: ActiveTabs;
  selectors: Selectors;
  setActiveTab: (activeTab: ActiveTabs) => void;
  setInitialTabs: () => void;
}

const defaultContextValue: TabContextState = {
  activeTabs: {},
  selectors: {},
  setActiveTab: (activeTab: ActiveTabs) => {},
  setInitialTabs: () => {},
};

const TabContext = React.createContext(defaultContextValue);

const reducer = (prevState: ActiveTabs, newState: Partial<ActiveTabs>): ActiveTabs => {
  return Object.fromEntries(
    Object.entries({ ...prevState, ...newState }).filter(([_, value]) => value !== undefined)
  ) as ActiveTabs;
};

// Helper fn to get default tabs for fallback (when no local storage found).
// For drivers tabs,
// 1. return default tab if available
// 2. return 'nodejs' if found
// Otherwise, return first choice.
const getDefaultTabs = (choicesPerSelector: ChoicesPerSelector, defaultTabs: ActiveTabs) =>
  Object.keys(choicesPerSelector || {}).reduce<ActiveTabs>((res, selectorKey) => {
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
const getLocalTabs = (localTabs: ActiveTabs, selectors: Selectors) =>
  Object.keys(localTabs).reduce<ActiveTabs>((res, activeTabKey) => {
    if (selectors?.[activeTabKey]?.[localTabs[activeTabKey]]) {
      res[activeTabKey] = localTabs[activeTabKey];
    }
    return res;
  }, {});

const TabProvider = ({
  children,
  selectors = {},
  defaultTabs = {},
}: {
  children: ReactNode[];
  selectors: Selectors;
  defaultTabs: ActiveTabs;
}) => {
  // init value to {} to match server and client side
  const { hash } = useLocation();
  const [activeTabs, setActiveTab] = useReducer(reducer, {});
  const { setActiveSelectorIds } = useContext(ContentsContext);

  const initLoaded = useRef(false);

  const setInitialTabs = () => {
    // convert selectors to tab options first here, then set init values
    // selectors are determined at build time
    const choicesPerSelector = Object.keys(selectors).reduce<ChoicesPerSelector>((res, selector) => {
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
    setActiveTab({ ...defaultRes, ...localActiveTabs });
  }

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
    // If hash, do not set tabs (tab state will be set in use-hash-anchor.tsx)
    if (hash?.length > 1) {
      initLoaded.current = true;
      return;
    }
    setInitialTabs();
    initLoaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TabContext.Provider
      value={{
        activeTabs,
        selectors,
        setActiveTab,
        setInitialTabs,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export { TabContext, TabProvider };
