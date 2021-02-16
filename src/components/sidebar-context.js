import React, { createContext, useState } from 'react';

const SidebarContext = createContext({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: null,
});

const SidebarContextProvider = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <SidebarContext.Provider
      value={{
        isMobileMenuOpen,
        setIsMobileMenuOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext, SidebarContextProvider };
