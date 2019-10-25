import React from 'react';

export const TOCContext = React.createContext({
  activeSection: undefined,
  toggleDrawer: () => {},
  toggleSidebar: () => {},
});
