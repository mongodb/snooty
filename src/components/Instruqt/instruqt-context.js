import React, { useState } from 'react';

const defaultContextValue = {
  hasLab: false,
  isOpen: false,
  setIsOpen: () => {},
};

const InstruqtContext = React.createContext(defaultContextValue);

const InstruqtProvider = ({ children, hasInstruqtLab }) => {
  const hasLab = hasInstruqtLab;
  // Temporarily default state to true for dev purposes. We can change this back to false once the page heading
  // button is implemented (DOP-4281)
  const [isOpen, setIsOpen] = useState(true);

  return <InstruqtContext.Provider value={{ hasLab, isOpen, setIsOpen }}>{children}</InstruqtContext.Provider>;
};

InstruqtProvider.defaultProps = {
  hasInstruqtLab: false,
};

export { InstruqtContext, InstruqtProvider };
