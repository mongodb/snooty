/**
 * Context to dictate dark mode UI for rest of page
 * Should be on top level, and dictates LG Provider Context
 * which in turn controls all UI elements within the page
 * https://github.com/mongodb/leafygreen-ui/blob/main/STYLEGUIDE.md#consuming-darkmode-from-leafygreenprovider
 */

import React, { createContext, useEffect, useRef, useState } from 'react';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import Button from '@leafygreen-ui/button';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';

const DarkModeContex = createContext({
  darkMode: false,
  setDarkMode: () => {},
});

const DarkModeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState();
  const loaded = useRef();

  // save to local value when darkmode changes, besides initial load
  useEffect(() => {
    if (loaded.current) {
      console.log('setting local value for darkMode ', darkMode);
      setLocalValue('darkMode', darkMode);
    } else {
      loaded.current = true;
    }
  }, [darkMode]);

  // NOTE: client side read of darkmode from local storage
  // occurs after component mounts, not during build time
  // TODO: DOP-4671 - set based on system setting as well as previous selection
  useEffect(() => {
    setDarkMode(getLocalValue('darkMode'));
  }, []);

  return (
    <DarkModeContex.Provider value={{ darkMode, setDarkMode }}>
      <LeafyGreenProvider baseFontSize={16} darkMode={darkMode}>
        {/* TODO: remove button for testing */}
        <Button
          onClick={() => {
            setDarkMode(!darkMode);
          }}
        >
          Click to toggle Dark Mode
        </Button>
        {children}
      </LeafyGreenProvider>
    </DarkModeContex.Provider>
  );
};

export { DarkModeContex, DarkModeContextProvider };
