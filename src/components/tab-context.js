import React, { useEffect, useReducer } from 'react';
import IconC from './icons/C';
import IconCompass from './icons/Compass';
import IconCpp from './icons/Cpp';
import IconCsharp from './icons/Csharp';
import IconGo from './icons/Go';
import IconJava from './icons/Java';
import IconNode from './icons/Node';
import IconPHP from './icons/Php';
import IconPython from './icons/Python';
import IconRuby from './icons/Ruby';
import IconRust from './icons/Rust';
import IconScala from './icons/Scala';
import IconShell from './icons/Shell';
import IconSwift from './icons/Swift';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';

const DRIVER_ICON_MAP = {
  c: IconC,
  compass: IconCompass,
  cpp: IconCpp,
  csharp: IconCsharp,
  go: IconGo,
  'java-sync': IconJava,
  'java-async': IconJava,
  nodejs: IconNode,
  php: IconPHP,
  python: IconPython,
  ruby: IconRuby,
  rust: IconRust,
  scala: IconScala,
  shell: IconShell,
  'swift-async': IconSwift,
  'swift-sync': IconSwift,
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

const TabProvider = ({ children, selectors = {} }) => {
  const [activeTabs, setActiveTab] = useReducer(reducer, getLocalValue('activeTabs') || defaultContextValue.activeTabs);

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
