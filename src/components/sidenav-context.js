import React, { createContext, useState } from 'react';

const SidenavContext = createContext({
  isSideNavEnabled: true,
  isCollapsed: true,
  setCollapsed: () => {},
});

const SidenavContextProvider = ({ children, isSidenavEnabled = true }) => {
  const [isCollapsed, setCollapsed] = useState(true);

  return (
    <SidenavContext.Provider
      value={{
        isSidenavEnabled,
        isCollapsed,
        setCollapsed,
      }}
    >
      {children}
    </SidenavContext.Provider>
  );
};

export { SidenavContext, SidenavContextProvider };
