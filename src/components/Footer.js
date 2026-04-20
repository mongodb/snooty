import React from 'react';
import { UnifiedFooter } from '@mdb/consistent-nav';
import { getCurrLocale, onSelectLocale } from '../utils/locale';
import { useLocale } from '../context/locale';

const Footer = () => {
  const { enabledLocales } = useLocale();
  return <UnifiedFooter onSelectLocale={onSelectLocale} locale={getCurrLocale()} enabledLocales={enabledLocales} />;
};

export default Footer;
