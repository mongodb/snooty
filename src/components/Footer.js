import React from 'react';
import { UnifiedFooter } from '@mdb/consistent-nav';
import { AVAILABLE_LANGUAGES, getCurrLocale, onSelectLocale } from '../utils/locale';

const Footer = () => {
  const enabledLocales = AVAILABLE_LANGUAGES.map((language) => language.localeCode);
  return <UnifiedFooter onSelectLocale={onSelectLocale} locale={getCurrLocale()} enabledLocales={enabledLocales} />;
};

export default Footer;
