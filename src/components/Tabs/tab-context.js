/**
 * Context that contains language selector tab data
 * Stores which tab is currently active by reading local storage
 * or by setting default values, and allows
 * child components to read and update
 */

import React, { useEffect, useReducer } from 'react';
import IconC from '../icons/C';
import IconCompass from '../icons/Compass';
import IconCpp from '../icons/Cpp';
import IconCsharp from '../icons/Csharp';
import IconGo from '../icons/Go';
import IconJava from '../icons/Java';
import IconKotlin from '../icons/Kotlin';
import IconNode from '../icons/Node';
import IconPHP from '../icons/Php';
import IconPython from '../icons/Python';
import IconRuby from '../icons/Ruby';
import IconRust from '../icons/Rust';
import IconScala from '../icons/Scala';
import IconShell from '../icons/Shell';
import IconSwift from '../icons/Swift';
import { getLocalValue, setLocalValue } from '../../utils/browser-storage';
import IconObjectiveC from '../icons/ObjectiveC';
import IconJavascript from '../icons/Javascript';
import IconTypescript from '../icons/Typescript';
import IconDart from '../icons/Dart';
import { isBrowser } from '../../utils/is-browser';
import { makeChoices } from './TabSelectors';

const DRIVER_ICON_MAP = {
  c: IconC,
  compass: IconCompass,
  cpp: IconCpp,
  csharp: IconCsharp,
  dart: IconDart,
  go: IconGo,
  java: IconJava,
  'java-sync': IconJava,
  'java-async': IconJava,
  javascript: IconJavascript,
  kotlin: IconKotlin,
  'kotlin-coroutine': IconKotlin,
  'kotlin-sync': IconKotlin,
  nodejs: IconNode,
  objectivec: IconObjectiveC,
  php: IconPHP,
  python: IconPython,
  ruby: IconRuby,
  rust: IconRust,
  scala: IconScala,
  shell: IconShell,
  swift: IconSwift,
  'swift-async': IconSwift,
  'swift-sync': IconSwift,
  typescript: IconTypescript,
};

const defaultContextValue = {
  activeTabs: {},
  driverIconMap: DRIVER_ICON_MAP,
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
    <TabContext.Provider value={{ activeTabs, driverIconMap: DRIVER_ICON_MAP, selectors, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export { TabContext, TabProvider };
