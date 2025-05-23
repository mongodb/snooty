import { createContext, useState, Dispatch, SetStateAction } from 'react';
import useScreenSize from '../../hooks/useScreenSize';

interface SidenavContextType {
  hideMobile: boolean;
  isCollapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  setHideMobile: Dispatch<SetStateAction<boolean>>;
}

const SidenavContext = createContext<SidenavContextType>({
  hideMobile: true,
  isCollapsed: true,
  setCollapsed: () => {},
  setHideMobile: () => {},
});

interface SidenavContextProviderProps {
  children: React.ReactNode;
}

const SidenavContextProvider = ({ children }: SidenavContextProviderProps) => {
  const { isTablet } = useScreenSize();
  const [isCollapsed, setCollapsed] = useState(isTablet);
  // Hide the Sidenav with css while keeping state as open/not collapsed.
  // This prevents LG's SideNav component from being seen in its collapsed state on mobile
  const [hideMobile, setHideMobile] = useState(true);

  return (
    <SidenavContext.Provider
      value={{
        hideMobile,
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
