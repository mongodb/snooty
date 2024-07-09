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
  setDarkModePref: () => {},
  darkModePref: 'light-theme',
});

export const DARK_THEME_CLASSNAME = 'dark-theme';
export const LIGHT_THEME_CLASSNAME = 'light-theme';
export const SYSTEM_THEME_CLASSNAME = 'system';

const DarkModeContextProvider = ({ children }) => {
  const docClassList = useMemo(() => isBrowser && window?.document?.documentElement?.classList, []);

  // darkModePref   {str}   'light-theme' || 'dark-theme' || 'system';
  const [darkModePref, setDarkModePref] = useState(() => {
    if (!docClassList) return 'light-theme';
    return docClassList.contains(SYSTEM_THEME_CLASSNAME)
      ? SYSTEM_THEME_CLASSNAME
      : docClassList.contains(DARK_THEME_CLASSNAME)
      ? DARK_THEME_CLASSNAME
      : LIGHT_THEME_CLASSNAME;
  });
  const loaded = useRef();

  // update document class list to apply dark-theme/light-theme to whole document
  const updateDocumentClasslist = useCallback((darkModePref, darkPref) => {
    if (!isBrowser || !docClassList) return;
    docClassList.add(darkModePref);
    const removeClassnames = new Set([LIGHT_THEME_CLASSNAME, DARK_THEME_CLASSNAME, SYSTEM_THEME_CLASSNAME]);
    removeClassnames.delete(darkModePref);
    if (darkModePref === 'system') {
      const themeClass = darkPref ? DARK_THEME_CLASSNAME : LIGHT_THEME_CLASSNAME;
      docClassList.add(themeClass);
      removeClassnames.delete(themeClass);
    }
    for (const className of removeClassnames) {
      if (className !== darkModePref) docClassList.remove(className);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const darkPref = useMedia(theme.colorPreference.dark);
  // save to local value when darkmode changes, besides initial load
  // also updates document classlist if darkModePref or darkPref changes
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    setLocalValue('theme', darkModePref);
    updateDocumentClasslist(darkModePref, darkPref);
  }, [darkModePref, updateDocumentClasslist, darkPref]);

  return (
    <DarkModeContext.Provider value={{ setDarkModePref, darkModePref }}>
      <LeafyGreenProvider
        baseFontSize={16}
        darkMode={darkModePref === 'dark-theme' || (darkModePref === 'system' && darkPref) ? true : false}
      >
        {children}
      </LeafyGreenProvider>
    </DarkModeContext.Provider>
  );
};

export { DarkModeContext, DarkModeContextProvider };
