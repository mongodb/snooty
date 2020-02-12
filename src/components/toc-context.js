import React from 'react';

export const TOCContext = React.createContext({
  activeDrawers: undefined,
  activePage: undefined,
  toggleDrawer: () => {},
  togglePage: () => {},
});
