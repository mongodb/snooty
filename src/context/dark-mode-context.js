/**
 * Context to dictate dark mode UI for rest of page
 * Should be on top level, and dictates LG Provider Context
 * which in turn controls all UI elements within the page
 * https://github.com/mongodb/leafygreen-ui/blob/main/STYLEGUIDE.md#consuming-darkmode-from-leafygreenprovider
 */

import React, { createContext, useEffect, useRef, useState } from 'react';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import Button from '@leafygreen-ui/button';
import { setLocalValue } from '../utils/browser-storage';
import { isBrowser } from '../utils/is-browser';

const DarkModeContex = createContext({
  darkMode: false,
  setDarkMode: () => {},
});

const DARK_THEME_CLASSNAME = 'dark-theme';
const LIGHT_THEME_CLASSNAME = 'light-theme';

const DarkModeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const loaded = useRef();

  // save to local value when darkmode changes, besides initial load
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    setLocalValue('theme', darkMode ? DARK_THEME_CLASSNAME : LIGHT_THEME_CLASSNAME);
    if (isBrowser) {
      const documentClasses = window.document.documentElement.classList;
      documentClasses.remove(LIGHT_THEME_CLASSNAME, DARK_THEME_CLASSNAME);
      documentClasses.add(darkMode ? DARK_THEME_CLASSNAME : LIGHT_THEME_CLASSNAME);
    }
  }, [darkMode]);

  // NOTE: client side read of darkmode from document classnames
  // which is derived from local storage (see gatsby-ssr script).
  // This occurs after component mounts, not during build time
  useEffect(() => {
    setDarkMode(isBrowser ? window?.document?.documentElement?.classList?.contains(DARK_THEME_CLASSNAME) : false);
  }, []);

  return (
    <DarkModeContex.Provider value={{ darkMode, setDarkMode }}>
      <LeafyGreenProvider baseFontSize={16} darkMode={darkMode}>
        {process.env['GATSBY_ENABLE_DARK_MODE'] === 'true' && (
          <Button
            onClick={() => {
              setDarkMode(!darkMode);
            }}
          >
            Click to toggle Dark Mode
          </Button>
        )}
        {children}
      </LeafyGreenProvider>
    </DarkModeContex.Provider>
  );
};

export { DarkModeContex, DarkModeContextProvider };
