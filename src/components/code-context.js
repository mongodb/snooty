import React, { useContext, useMemo } from 'react';
import { Language } from '@leafygreen-ui/code';
import LeafyIcon from '@leafygreen-ui/icon';
import { TabContext } from './tab-context';
import { getPlaintext } from '../utils/get-plaintext';

const defaultContextValue = {
  codeBlockLanguage: null,
  languageOptions: [],
};

const CodeContext = React.createContext(defaultContextValue);

const LANGUAGES = new Set(Object.values(Language));

// Custom mapping for unique drivers that don't have an exact 1:1 name to LG language mapping
const DRIVER_LANGUAGE_MAPPING = {
  clike: new Set(['c', 'cpp', 'c#']),
  javascript: new Set(['compass', 'nodejs', 'shell']),
  python: new Set(['motor']),
};

// Returns the LG-supported language that corresponds with one of our documented drivers
const getDriverLanguage = (driverArg) => {
  // Simplifies driver to language matching for drivers like "java-sync"
  const driver = driverArg?.split('-')[0];

  for (const language in DRIVER_LANGUAGE_MAPPING) {
    const driversSet = DRIVER_LANGUAGE_MAPPING[language];
    if (driversSet.has(driver)) {
      return language;
    }
  }

  if (LANGUAGES.has(driver)) {
    return driver;
  }

  // LG Code default language
  return 'none';
};

// Returns the icon associated with the driver language that would be
// shown on our TabSelector component
const getDriverImage = (driver, driverIconMap) => {
  const DriverIcon = driverIconMap?.[driver];
  if (DriverIcon) {
    return <DriverIcon />;
  }

  // LG Code default file icon; not formally added in their code yet,
  // but is mentioned in a source code comment
  return <LeafyIcon glyph="File" />;
};

// Generates language options for code block based on drivers tabset
const generateLanguageOptions = (selectors, driverIconMap) => {
  if (!(selectors && Object.keys(selectors).length > 0 && selectors['drivers'])) {
    return null;
  }

  const drivers = selectors['drivers'];
  const languageOptions = [];

  for (const driver in drivers) {
    languageOptions.push({
      id: driver,
      displayName: getPlaintext(drivers[driver]),
      image: getDriverImage(driver, driverIconMap),
      language: getDriverLanguage(driver),
    });
  }

  return languageOptions;
};

// Returns the display name of the current driver selected
const getCurrentLanguageOption = (languageOptions, activeTabs) => {
  const currentTab = activeTabs?.drivers;

  if (!(languageOptions && languageOptions.length > 0 && currentTab)) {
    return null;
  }

  const currentLangOption = languageOptions.find((option) => option.id === currentTab);
  // LG Code block's language switcher uses the display name to select the current "language"
  return currentLangOption?.displayName || null;
};

const CodeProvider = ({ children }) => {
  const { activeTabs, driverIconMap, selectors } = useContext(TabContext);
  const languageOptions = useMemo(() => generateLanguageOptions(selectors, driverIconMap), [driverIconMap, selectors]);
  const codeBlockLanguage = useMemo(() => getCurrentLanguageOption(languageOptions, activeTabs), [
    activeTabs,
    languageOptions,
  ]);

  return <CodeContext.Provider value={{ codeBlockLanguage, languageOptions }}>{children}</CodeContext.Provider>;
};

export { CodeContext, CodeProvider };
