import React, { createContext, useState, useEffect } from 'react';
import useScreenSize from '../../hooks/useScreenSize';

const SidenavContext = createContext({
  hideMobile: true,
  isCollapsed: true,
  isAccordion: true,
  setCollapsed: () => {},
  setHideMobile: () => {},
  setAccordion: () => {},
});

const SidenavContextProvider = ({ children }) => {
  const { isTablet, isDesktop } = useScreenSize();
  const [isAccordion, setAccordion] = useState(isDesktop);
  const [isCollapsed, setCollapsed] = useState(isTablet);
  // Hide the Sidenav with css while keeping state as open/not collapsed.
  // This prevents LG's SideNav component from being seen in its collapsed state on mobile
  const [hideMobile, setHideMobile] = useState(true);

  useEffect(() => {
    setAccordion(isDesktop);
  }, [isDesktop]);

  return (
    <SidenavContext.Provider
      value={{
        hideMobile,
        isCollapsed,
        isAccordion,
        setCollapsed,
        setHideMobile,
        setAccordion,
      }}
    >
      {children}
    </SidenavContext.Provider>
  );
};

export { SidenavContext, SidenavContextProvider };
