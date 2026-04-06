import React from 'react';
import { LocalizedLinkProvider, UnifiedFooter } from '@mdb/consistent-nav';
import { getCurrLocale, onSelectLocale } from '../utils/locale';
import { useLocale } from '../context/locale';
import { getPagePath } from '../utils/get-page-path';

const Footer = () => {
  const { enabledLocales } = useLocale();
  const pagePath = getPagePath();

  return (
    <LocalizedLinkProvider origin="https://www.mongodb.com/docs" pageUrl={pagePath}>
      <UnifiedFooter onSelectLocale={onSelectLocale} locale={getCurrLocale()} enabledLocales={enabledLocales} />
    </LocalizedLinkProvider>
  );
};

export default Footer;
