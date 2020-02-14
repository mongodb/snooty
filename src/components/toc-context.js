import React from 'react';

export const TOCContext = React.createContext({
  activePage: undefined,
  togglePage: () => {},
});
