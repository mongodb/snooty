import React from 'react';
import { baseUrl } from '../../utils/base-url';
import { STRUCTURED_DATA_CLASSNAME } from '../../utils/structured-data';

const DocsLandingSD = () => (
  <script className={STRUCTURED_DATA_CLASSNAME} type="application/ld+json">
    {JSON.stringify({
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      name: 'MongoDB Documentation',
      url: baseUrl(),
      publisher: {
        '@type': 'Organization',
        name: 'MongoDB',
        logo: {
          '@type': 'imageObject',
          url: 'https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png',
        },
      },
      author: 'MongoDB Documentation Team',
      inLanguage: 'English',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://mongodb.com/docs/search/?q={search_term_string}&page=1',
        },
        'query-input': 'required name=search_term_string',
      },
    })}
  </script>
);

export default DocsLandingSD;
