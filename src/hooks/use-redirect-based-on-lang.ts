import React, { useEffect } from 'react';
import redirectBasedOnLang from '../utils/head-scripts/redirect-based-on-lang';

// This has to work alongside the gatsby-ssr script for redirects since gatsby-ssr scripts only run on INITIAL site access.
// This hook allows other pages accessed through internal site navigation to work.
export const useRedirectBasedOnLang = () => {
  useEffect(() => {
    const hardcodedLimitedTranslations = [
      {
        "locale": "es",
        "pages": [
          "/alert-resolutions",
          "/alerts",
          "/analyze-slow-queries"
        ],
        "callout": "Only a subset of the docs are available in Spanish"
      },
      {
        "locale": "fr-fr",
        "pages": [
          "/alert-resolutions",
          "/alerts",
          "/analyze-slow-queries"
        ],
        "callout": "Only a subset of the docs are available in French"
      }
    ];
    redirectBasedOnLang(hardcodedLimitedTranslations);
  }, []);
};
