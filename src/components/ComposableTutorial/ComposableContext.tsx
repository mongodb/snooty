import React, { createContext, useEffect, useState } from 'react';

const ComposableContext = createContext<{
  currentSelections: Record<string, string>;
  setCurrentSelections: (selections: Record<string, string>) => void;
}>({
  currentSelections: {},
  setCurrentSelections: () => {},
});

export const ComposableContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSelections, setCurrentSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log('currentSelections changed', currentSelections);
  }, [currentSelections]);

  return (
    <ComposableContext.Provider value={{ currentSelections, setCurrentSelections }}>
      {children}
    </ComposableContext.Provider>
  );
};

export default ComposableContext;
