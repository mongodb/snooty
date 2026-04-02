import React from 'react';
import { LocalizedLinkProvider, UnifiedFooter } from '@mdb/consistent-nav';
import { getCurrLocale, onSelectLocale } from '../utils/locale';
import { useLocale } from '../context/locale';
import { getPageUrl } from '../utils/get-page-url';

const Footer = () => {
  const { enabledLocales } = useLocale();
  const pageUrl = getPageUrl();

  return (
    <LocalizedLinkProvider origin="https://www.mongodb.com" pageUrl={pageUrl}>
      <UnifiedFooter onSelectLocale={onSelectLocale} locale={getCurrLocale()} enabledLocales={enabledLocales} />
    </LocalizedLinkProvider>
  );
};

export default Footer;
