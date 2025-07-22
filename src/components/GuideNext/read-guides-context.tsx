import React, { createContext, useState, useEffect } from 'react';
import { getLocalValue, setLocalValue } from '../../utils/browser-storage';

interface ReadGuidesContextType {
  readGuides: Record<string, boolean>;
}

const ReadGuidesContext = createContext<ReadGuidesContextType>({
  readGuides: {},
});

export type ReadGuidesContextProviderProps = {
  children: React.ReactNode;
  slug: string;
};

const ReadGuidesContextProvider = ({ children, slug }: ReadGuidesContextProviderProps) => {
  const localStorageKey = 'readGuides';
  const [readGuides, setReadGuides] = useState({});

  useEffect(() => {
    setReadGuides(getLocalValue(localStorageKey));
  }, []);

  useEffect(() => {
    if (!readGuides[slug as keyof typeof readGuides]) {
      setReadGuides((prevState) => ({
        ...prevState,
        [slug]: true,
      }));
    }
  }, [readGuides, setReadGuides, slug]);

  useEffect(() => {
    setLocalValue(localStorageKey, readGuides);
  }, [localStorageKey, readGuides]);

  return <ReadGuidesContext.Provider value={{ readGuides: readGuides }}>{children}</ReadGuidesContext.Provider>;
};

export { ReadGuidesContext, ReadGuidesContextProvider };
