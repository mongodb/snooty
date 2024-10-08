import React, { createContext, useContext } from 'react';

const defaultVal = {
  table: false,
  procedure: false,
};

const AncestorComponentContext = createContext(defaultVal);

/**
 * Context provider to help track ancestors of components without ambiguous prop drilling.
 * If nested within another component that uses this provder, previous ancestors are persisted.
 */
const AncestorComponentContextProvider = ({ children, component }) => {
  const prevAncestors = useAncestorComponentContext();
  const newAncestors = { ...prevAncestors };

  if (component) {
    newAncestors[component] = true;
  }

  return <AncestorComponentContext.Provider value={newAncestors}>{children}</AncestorComponentContext.Provider>;
};

/**
 * By default, all ancestors will be false.
 */
const useAncestorComponentContext = () => {
  return useContext(AncestorComponentContext);
};

export { AncestorComponentContextProvider, useAncestorComponentContext };
