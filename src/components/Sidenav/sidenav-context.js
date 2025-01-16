import React, { createContext, useState } from 'react';
import useScreenSize from '../../hooks/useScreenSize';

const SidenavContext = createContext({
  hideMobile: true,
  isCollapsed: true,
  activeTab: 'Get Started',
  setCollapsed: () => {},
  setHideMobile: () => {},
  setActiveTab: () => {},
});

const SidenavContextProvider = ({ children }) => {
  const { isTablet } = useScreenSize();
  const [isCollapsed, setCollapsed] = useState(isTablet);
  // Hide the Sidenav with css while keeping state as open/not collapsed.
  // This prevents LG's SideNav component from being seen in its collapsed state on mobile
  const [hideMobile, setHideMobile] = useState(true);
  const [activeTab, setActiveTab] = useState('Get Started');

  return (
    <SidenavContext.Provider
      value={{
        hideMobile,
        isCollapsed,
        activeTab,
        setCollapsed,
        setHideMobile,
        setActiveTab,
      }}
    >
      {children}
    </SidenavContext.Provider>
  );
};

export { SidenavContext, SidenavContextProvider };
