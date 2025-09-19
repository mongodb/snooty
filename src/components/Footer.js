import React, { useContext } from 'react';
import { UnifiedFooter } from '@mdb/consistent-nav';
import { getCurrLocale, onSelectLocale } from '../utils/locale';
import { LocaleContext } from '../context/locale';

const Footer = () => {
  const { enabledLocalesData } = useContext(LocaleContext);
  const enabledLocales = enabledLocalesData.map((language) => language.localeCode);
  return <UnifiedFooter onSelectLocale={onSelectLocale} locale={getCurrLocale()} enabledLocales={enabledLocales} />;
};

export default Footer;
