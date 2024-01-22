import React, { useState } from 'react';

const defaultContextValue = {
  hasLab: false,
  isOpen: false,
  setIsOpen: () => {},
};

const InstruqtContext = React.createContext(defaultContextValue);

const InstruqtProvider = ({ children, hasInstruqtLab }) => {
  const hasLab = hasInstruqtLab;
  const [isOpen, setIsOpen] = useState(false);

  return <InstruqtContext.Provider value={{ hasLab, isOpen, setIsOpen }}>{children}</InstruqtContext.Provider>;
};

InstruqtProvider.defaultProps = {
  hasInstruqtLab: false,
};

export { InstruqtContext, InstruqtProvider };
