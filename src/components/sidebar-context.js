import { createContext } from 'react';

const SidebarContext = createContext({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: null,
});

export default SidebarContext;
