import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import {
  AvailableLanguageData,
  AvailableLocaleType,
  BETA_LOCALE,
  getAvailableLanguages,
  getCurrLocale,
} from '../utils/locale';

type LocaleContextType = {
  enabledLocalesData: AvailableLanguageData[];
  updateAvailableLocales?: (locale: AvailableLocaleType) => void;
};

const LocaleContext = createContext<LocaleContextType>({
  enabledLocalesData: getAvailableLanguages(),
});

const LocaleProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [enabledLocalesData, setEnableLocalesData] = useState<AvailableLanguageData[]>([]);
  const locale = getCurrLocale();

  const betaLocale = BETA_LOCALE[locale];

  useEffect(() => {
    const betaLocals = ['es'];
    /**
     * Grab the available languages and if the current locale is included in the
     * beta list of locale, add it to the enable locales data which will be used by the
     * unified header and footer.
     * If not then just use the default available languages
     */
    const data = getAvailableLanguages();
    if (betaLocals.includes(locale) && betaLocale) {
      setEnableLocalesData([...data, betaLocale]);
    } else {
      setEnableLocalesData(data);
    }
  }, [locale, betaLocale]);

  return <LocaleContext.Provider value={{ enabledLocalesData }}>{children}</LocaleContext.Provider>;
};

export { LocaleContext, LocaleProvider };
