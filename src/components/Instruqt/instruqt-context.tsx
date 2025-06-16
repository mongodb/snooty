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

export type InstruqtProviderProps = {
  children: ReactNode;
  hasLabDrawer?: boolean;
};

const InstruqtProvider = ({ children, hasLabDrawer = false }: InstruqtProviderProps) => {
  const hasDrawer = hasLabDrawer;
  const [isOpen, setIsOpen] = useState(false);

  return <InstruqtContext.Provider value={{ hasDrawer, isOpen, setIsOpen }}>{children}</InstruqtContext.Provider>;
};

export { InstruqtContext, InstruqtProvider };
