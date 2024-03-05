import React, { useEffect } from 'react';
import { withPrefix } from 'gatsby';
import { useLocation } from '@gatsbyjs/reach-router';
import { UnifiedFooter } from '@mdb/consistent-nav';
import { isBrowser } from '../utils/is-browser';
import { assertTrailingSlash } from '../utils/assert-trailing-slash';

const HIDE_UNIFIED_FOOTER_LOCALE = process.env['GATSBY_HIDE_UNIFIED_FOOTER_LOCALE'] === 'true';
const AVAILABLE_LANGUAGES = ['English', '简体中文', '한국어', 'Português'];

const Footer = ({ slug }) => {
  const location = useLocation();
  // handle the `/` path
  const slugForUrl = slug === '/' ? `${withPrefix('')}` : `${withPrefix(slug)}`;

  const onSelectLocale = (locale) => {
    const localeHrefMap = {
      'zh-cn': `${location.origin}/zh-cn${slugForUrl}`,
      'en-us': `${location.origin}${slugForUrl}`,
      'ko-kr': `${location.origin}/ko-kr${slugForUrl}`,
      'pt-br': `${location.origin}/pt-br${slugForUrl}`,
    };

    if (isBrowser) {
      window.location.href = assertTrailingSlash(localeHrefMap[locale]);
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
          if (AVAILABLE_LANGUAGES.includes(child.textContent)) {
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
