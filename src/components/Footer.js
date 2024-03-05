import React, { useEffect } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { UnifiedFooter } from '@mdb/consistent-nav';
import { isBrowser } from '../utils/is-browser';
import { AVAILABLE_LANGUAGES, getLocaleMapping } from '../utils/locale';

const HIDE_UNIFIED_FOOTER_LOCALE = process.env['GATSBY_HIDE_UNIFIED_FOOTER_LOCALE'] === 'true';

const Footer = ({ slug }) => {
  const location = useLocation();

  const onSelectLocale = (locale) => {
    const localeHrefMap = getLocaleMapping(location, slug);

    if (isBrowser) {
      window.location.href = localeHrefMap[locale];
    }
  };

  // A workaround to remove the other locale options
  useEffect(() => {
    if (!HIDE_UNIFIED_FOOTER_LOCALE) {
      const footer = document.getElementById('footer-container');
      const footerUlElement = footer?.querySelector('ul[role=listbox]');
      if (footerUlElement) {
        // We only want to support English, Simple Chinese, Korean, and Portuguese for now.
        const availableOptions = Array.from(footerUlElement.childNodes).reduce((accumulator, child) => {
          if (AVAILABLE_LANGUAGES.find(({ language }) => child.textContent === language)) {
            accumulator.push(child);
          }
          return accumulator;
        }, []);

        footerUlElement.innerHTML = null;
        availableOptions.forEach((child) => {
          footerUlElement.appendChild(child);
        });
      }
    }
  }, []);

  return <UnifiedFooter hideLocale={HIDE_UNIFIED_FOOTER_LOCALE} onSelectLocale={onSelectLocale} />;
};

export default Footer;
