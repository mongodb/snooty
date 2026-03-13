import React from 'react';
import { LocalizedLinkProvider, UnifiedFooter } from '@mdb/consistent-nav';
import { getCurrLocale, onSelectLocale, stripLocale } from '../utils/locale';
import { useLocale } from '../context/locale';
import { isBrowser } from '../utils/is-browser';

const Footer = () => {
  const { enabledLocales } = useLocale();
  const pageUrl = (() => {
    if (isBrowser) return stripLocale(window.location.pathname);
    else return '';
  })();

  return (
    <LocalizedLinkProvider origin="https://www.mongodb.com/docs" pageUrl={pageUrl}>
      <UnifiedFooter onSelectLocale={onSelectLocale} locale={getCurrLocale()} enabledLocales={enabledLocales} />
    </LocalizedLinkProvider>
  );
};

export default Footer;
