import React, { createContext, useState, useEffect } from 'react';
import { getLocalValue, setLocalValue } from '../../utils/browser-storage';

const ReadGuidesContext = createContext({
  readGuides: {},
});

const ReadGuidesContextProvider = ({ children, slug }) => {
  const localStorageKey = 'readGuides';
  const [readGuides, setReadGuides] = useState({});

  useEffect(() => {
    setReadGuides(getLocalValue(localStorageKey));
  }, []);

  useEffect(() => {
    if (!readGuides[slug]) {
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
