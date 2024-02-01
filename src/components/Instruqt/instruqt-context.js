import React, { useState } from 'react';

const defaultContextValue = {
  hasDrawer: false,
  isOpen: false,
  setIsOpen: () => {},
};

const InstruqtContext = React.createContext(defaultContextValue);

const InstruqtProvider = ({ children, hasLabDrawer }) => {
  const hasDrawer = hasLabDrawer;
  const [isOpen, setIsOpen] = useState(false);

  return <InstruqtContext.Provider value={{ hasDrawer, isOpen, setIsOpen }}>{children}</InstruqtContext.Provider>;
};

InstruqtProvider.defaultProps = {
  hasLabDrawer: false,
};

export { InstruqtContext, InstruqtProvider };
