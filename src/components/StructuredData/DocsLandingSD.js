import React from 'react';
import { baseUrl } from '../../utils/base-url';

const DocsLandingSD = () => (
  <>
    <script id="structured data" type="application/ld+json">
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
      })}
    </script>
  </>
);

export default DocsLandingSD;
