/**
 * Context to dictate dark mode UI for rest of page
 * Should be on top level, and dictates LG Provider Context
 * which in turn controls all UI elements within the page
 * https://github.com/mongodb/leafygreen-ui/blob/main/STYLEGUIDE.md#consuming-darkmode-from-leafygreenprovider
 */

import React, { createContext, useMemo, useEffect, useRef, useState, useCallback } from 'react';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { setLocalValue } from '../utils/browser-storage';
import useMedia from '../hooks/use-media';
import { isBrowser } from '../utils/is-browser';
import { theme } from '../theme/docsTheme';

const DarkModeContext = createContext({
  setDarkMode: () => {},
  darkMode: 'light-theme',
});

export const DARK_THEME_CLASSNAME = 'dark-theme';
export const LIGHT_THEME_CLASSNAME = 'light-theme';
export const SYSTEM_THEME_CLASSNAME = 'system';

const DarkModeContextProvider = ({ children }) => {
  const docClassList = useMemo(() => isBrowser && window?.document?.documentElement?.classList, []);

  // darkMode   {str}   'light-theme' || 'dark-theme' || 'system';
  const [darkMode, setDarkMode] = useState(() => {
    if (!isBrowser) return LIGHT_THEME_CLASSNAME;

    return docClassList.contains(SYSTEM_THEME_CLASSNAME)
      ? SYSTEM_THEME_CLASSNAME
      : docClassList.contains(DARK_THEME_CLASSNAME)
      ? DARK_THEME_CLASSNAME
      : LIGHT_THEME_CLASSNAME;
  });
  const loaded = useRef();

  // update document class list to apply dark-theme/light-theme to whole document
  const updateDocumentClasslist = useCallback((darkMode, darkPref) => {
    if (!isBrowser) return;
    docClassList.add(darkMode);
    const removeClassnames = new Set([LIGHT_THEME_CLASSNAME, DARK_THEME_CLASSNAME, SYSTEM_THEME_CLASSNAME]);
    removeClassnames.delete(darkMode);
    if (darkMode === 'system') {
      const themeClass = darkPref ? DARK_THEME_CLASSNAME : LIGHT_THEME_CLASSNAME;
      docClassList.add(themeClass);
      removeClassnames.delete(themeClass);
    }
    for (const className of removeClassnames) {
      if (className !== darkMode) docClassList.remove(className);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const darkPref = useMedia(theme.colorPreference.dark);
  // save to local value when darkmode changes, besides initial load
  // also updates document classlist if darkMode or darkPref changes
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    setLocalValue('theme', darkMode);
    updateDocumentClasslist(darkMode, darkPref);
  }, [darkMode, updateDocumentClasslist, darkPref]);

  return (
    <DarkModeContext.Provider value={{ setDarkMode, darkMode }}>
      <LeafyGreenProvider
        baseFontSize={16}
        darkMode={darkMode === 'dark-theme' || (darkMode === 'system' && darkPref) ? true : false}
      >
        {children}
      </LeafyGreenProvider>
    </DarkModeContext.Provider>
  );
};

export { DarkModeContext, DarkModeContextProvider };
