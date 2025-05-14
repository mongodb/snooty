import React, { useContext, useMemo } from 'react';
import { Language } from '@leafygreen-ui/code';
import { TabContext } from '../Tabs/tab-context';
import { getPlaintext } from '../../utils/get-plaintext';

const defaultContextValue = {
  codeBlockLanguage: null,
  languageOptions: [],
};

const CodeContext = React.createContext(defaultContextValue);

const LANGUAGES = new Set(Object.values(Language));

// Custom mapping for unique drivers that don't have an exact 1:1 name to LG language mapping
const DRIVER_LANGUAGE_MAPPING = {
  cs: new Set(['c', 'cpp']),
  javascript: new Set(['compass', 'nodejs', 'shell']),
  python: new Set(['motor']),
};

// Returns the LG-supported language that corresponds with one of our documented drivers
const getDriverLanguage = (driverArg) => {
  // Simplifies driver to language matching for drivers like "java-sync"
  const driver = driverArg?.split('-')[0];

  for (const language in DRIVER_LANGUAGE_MAPPING) {
    const driversSet = DRIVER_LANGUAGE_MAPPING[language];
    if (driversSet.has(driver) && LANGUAGES.has(language)) {
      return language;
    }
  }

  if (LANGUAGES.has(driver)) {
    return driver;
  }

  // LG Code default language
  return 'none';
};

// Generates language options for code block based on drivers tabset on current page
const generateLanguageOptions = (selectors = {}) => {
  const drivers = selectors?.['drivers'];
  const languageOptions = [];

  for (const driver in drivers) {
    languageOptions.push({
      id: driver,
      displayName: getPlaintext(drivers[driver]),
      language: getDriverLanguage(driver),
    });
  }

  return languageOptions;
};

// Returns the display name of the current driver selected
const getCurrentLanguageOption = (languageOptions, activeTabs) => {
  const currentTab = activeTabs?.drivers;
  if (!currentTab) {
    return null;
  }

  const currentLangOption = languageOptions.find((option) => option.id === currentTab);
  // LG Code block's language switcher uses the display name to select the current "language"
  return currentLangOption?.displayName;
};

const CodeProvider = ({ children }) => {
  const { activeTabs, selectors } = useContext(TabContext);
  const languageOptions = useMemo(() => generateLanguageOptions(selectors), [selectors]);
  const codeBlockLanguage = useMemo(
    () => getCurrentLanguageOption(languageOptions, activeTabs),
    [activeTabs, languageOptions]
  );

  return <CodeContext.Provider value={{ codeBlockLanguage, languageOptions }}>{children}</CodeContext.Provider>;
};

export { CodeContext, CodeProvider };
