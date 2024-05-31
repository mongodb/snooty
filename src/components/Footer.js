import React, { useEffect } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { UnifiedFooter } from '@mdb/consistent-nav';
import { isBrowser } from '../utils/is-browser';
import { AVAILABLE_LANGUAGES, getCurrLocale, getLocaleMapping, getLanguageSelectorOptions } from '../utils/locale';

const Footer = ({ slug }) => {
  const location = useLocation();

  const onSelectLocale = (locale) => {
    const localeHrefMap = getLocaleMapping(location.origin, slug);

    if (isBrowser) {
      window.location.href = localeHrefMap[locale];
    }
  };

  // A workaround to remove the other locale options
  useEffect(() => {
    const footer = document.getElementById('footer-container');
    console.log('FOOTER', footer);
    const footerUlElement = footer?.querySelector('ul[role=listbox]');
    console.log('UL ELEMENT', footerUlElement);
    if (footerUlElement) {
      // For DOP-4296 we only want to support English, Simple Chinese, Korean, and Portuguese.
      // const availableOptions = Array.from(footerUlElement.childNodes).reduce((accumulator, child) => {
      //   if (AVAILABLE_LANGUAGES.find(({ language }) => child.textContent === language)) {
      //     accumulator.push(child);
      //   }
      //   return accumulator;
      // }, []);

      // footerUlElement.innerHTML = null;
      // availableOptions.forEach((child) => {
      //   footerUlElement.appendChild(child);
      // });
      const availableOptions = getLanguageSelectorOptions(footerUlElement);
      footerUlElement.innerHTML = null;
      availableOptions.forEach((child) => {
        footerUlElement.appendChild(child);
      });
    }
  }, []);

  return <UnifiedFooter onSelectLocale={onSelectLocale} locale={getCurrLocale()} />;
};

export default Footer;
