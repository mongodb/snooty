import React, { useEffect, useReducer } from 'react';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';

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

const TabProvider = ({ children, selectors }) => {
  const [activeTabs, setActiveTab] = useReducer(reducer, getLocalValue('activeTabs') || defaultContextValue.activeTabs);

  useEffect(() => {
    setLocalValue('activeTabs', activeTabs);
  }, [activeTabs]);

  return <TabContext.Provider value={{ activeTabs, selectors, setActiveTab }}>{children}</TabContext.Provider>;
};

export { TabContext, TabProvider };
