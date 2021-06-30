import React, { createContext, useState } from 'react';

const SidebarContext = createContext({
  isSidebarEnabled: true,
  isCollapsed: true,
  setCollapsed: () => {},
});

const SidebarContextProvider = ({ children, isSidebarEnabled = true }) => {
  const [isCollapsed, setCollapsed] = useState(true);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarEnabled,
        isCollapsed,
        setCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext, SidebarContextProvider };
