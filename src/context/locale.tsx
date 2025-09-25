import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { AvailableLocaleType, BETA_LOCALE, getAvailableLanguages, getCurrLocale } from '../utils/locale';

type LocaleContextType = {
  enabledLocales: AvailableLocaleType[];
};

const gettingAvailableLanguages = (): AvailableLocaleType[] => {
  return getAvailableLanguages().map((lang) => lang.localeCode);
};

const LocaleContext = createContext<LocaleContextType>({
  enabledLocales: gettingAvailableLanguages(),
});

const LocaleProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [enabledLocales, setEnableLocalesData] = useState<AvailableLocaleType[]>([]);
  const locale = getCurrLocale();

  const betaLocale = BETA_LOCALE[locale].localeCode;

  useEffect(() => {
    const betaLocals = ['es'];
    /**
     * Grab the available languages and if the current locale is included in the
     * beta list of locale, add it to the enable locales data which will be used by the
     * unified header and footer.
     * If not then just use the default available languages
     */
    const data = gettingAvailableLanguages();
    if (betaLocals.includes(locale) && betaLocale) {
      setEnableLocalesData([...data, betaLocale]);
    } else {
      setEnableLocalesData(data);
    }
  }, [locale, betaLocale]);

  return <LocaleContext.Provider value={{ enabledLocales }}>{children}</LocaleContext.Provider>;
};

export { LocaleProvider };

export const useLocale = () => {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used within a LocalProvider');
  }

  return context;
};
