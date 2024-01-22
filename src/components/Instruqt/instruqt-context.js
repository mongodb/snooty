import React, { useEffect, useState } from 'react';

const defaultContextValue = {
  isOpen: false,
};

const InstruqtContext = React.createContext(defaultContextValue);

//function here to determine if page's AST has a lab

const InstruqtProvider = ({ children }) => {
  //update with function passed to use state to tell if lab is open
  const [isOpen, setIsOpen] = useState(false);

  //check that useEffect is the right function for this
  useEffect(() => {
    setIsOpen(false);
  }, [isOpen]);

  return <InstruqtContext.Provider value={{ isOpen, setIsOpen }}>{children}</InstruqtContext.Provider>;
};

export { InstruqtContext, InstruqtProvider };
