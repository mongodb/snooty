import React, { createContext, useState } from 'react';
import useScreenSize from '../hooks/useScreenSize';

const SidenavContext = createContext({
  hideMobile: true,
  isSideNavEnabled: true,
  isCollapsed: true,
  setCollapsed: () => {},
  setHideMobile: () => {},
});

const SidenavContextProvider = ({ children, isSidenavEnabled = true }) => {
  const { isTablet } = useScreenSize();
  const [isCollapsed, setCollapsed] = useState(isTablet);
  // Hide the Sidenav with css while keeping state as open/not collapsed.
  // This prevents LG's SideNav component from being seen in its collapsed state on mobile
  const [hideMobile, setHideMobile] = useState(true);

  return (
    <SidenavContext.Provider
      value={{
        hideMobile,
        isSidenavEnabled,
        isCollapsed,
        setCollapsed,
        setHideMobile,
      }}
    >
      {children}
    </SidenavContext.Provider>
  );
};

export { SidenavContext, SidenavContextProvider };
