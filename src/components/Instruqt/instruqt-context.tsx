import React, { Dispatch, ReactNode, SetStateAction, useState } from 'react';

interface InstruqtContextType {
  hasDrawer: boolean;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultContextValue: InstruqtContextType = {
  hasDrawer: false,
  isOpen: false,
  setIsOpen: () => {},
};

const InstruqtContext = React.createContext<InstruqtContextType>(defaultContextValue);

const InstruqtProvider = ({ children, hasLabDrawer = false }: { children: ReactNode; hasLabDrawer?: boolean }) => {
  const hasDrawer = hasLabDrawer;
  const [isOpen, setIsOpen] = useState(false);

  return <InstruqtContext.Provider value={{ hasDrawer, isOpen, setIsOpen }}>{children}</InstruqtContext.Provider>;
};

export { InstruqtContext, InstruqtProvider };
