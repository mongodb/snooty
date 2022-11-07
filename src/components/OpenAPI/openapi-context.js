import React, { createContext } from 'react';

const OpenAPIContext = createContext({
  store: {},
});

const OpenAPIContextProvider = ({ children, store }) => {
  const storeValue = store || {};
  return <OpenAPIContext.Provider value={{ store: storeValue }}>{children}</OpenAPIContext.Provider>;
};

export { OpenAPIContext, OpenAPIContextProvider };
