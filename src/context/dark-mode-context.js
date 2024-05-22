import React, { createContext, useEffect, useRef } from 'react';
import LeafyGreenProvider, { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import Button from '@leafygreen-ui/button';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';

const DarkModeContex = createContext({
  darkMode: false,
  setDarkMode: () => {},
});

const DarkModeContexProvider = ({ children }) => {
  const { setDarkMode, darkMode } = useDarkMode();
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

  // TODO: investigate why this is not upading dark mode
  // seems to set dark mode to local value, but no change
  useEffect(() => {
    console.log('on init local value for darkmode is ', getLocalValue('darkMode'));
    setDarkMode(getLocalValue('darkMode'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DarkModeContex.Provider value={{ darkMode: darkMode, setDarkMode }}>
      <LeafyGreenProvider baseFontSize={16} darkMode={darkMode}>
        {/* TODO: remove button for testing */}
        <Button
          onClick={() => {
            setDarkMode(!darkMode);
          }}
        >
          Click to toggle Dark Mode
        </Button>
        {/* {renderReady && children} */}
        {children}
      </LeafyGreenProvider>
    </DarkModeContex.Provider>
  );
};

export { DarkModeContex, DarkModeContexProvider };
