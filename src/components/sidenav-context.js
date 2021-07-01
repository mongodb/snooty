import React, { createContext, useState } from 'react';

const SidenavContext = createContext({
  isSidebarEnabled: true,
  isCollapsed: true,
  setCollapsed: () => {},
});

const SidenavContextProvider = ({ children, isSidebarEnabled = true }) => {
  const [isCollapsed, setCollapsed] = useState(true);

  return (
    <SidenavContext.Provider
      value={{
        isSidebarEnabled,
        isCollapsed,
        setCollapsed,
      }}
    >
      {children}
    </SidenavContext.Provider>
  );
};

export { SidenavContext, SidenavContextProvider };
