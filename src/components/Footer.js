import React from 'react';
import { UnifiedFooter } from '@mdb/consistent-nav';
import { getAvailableLanguages, getCurrLocale, onSelectLocale } from '../utils/locale';

const Footer = () => {
  const enabledLocales = getAvailableLanguages().map((language) => language.localeCode);
  return <UnifiedFooter onSelectLocale={onSelectLocale} locale={getCurrLocale()} enabledLocales={enabledLocales} />;
};

export default Footer;
