import React from 'react';
import PropTypes from 'prop-types';
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { BreadcrumbListSd, STRUCTURED_DATA_CLASSNAME } from '../../utils/structured-data.js';
import { useSiteMetadata } from '../../hooks/use-site-metadata.tsx';

const BreadcrumbSchema = ({ slug }) => {
  const { parentPaths, title: siteTitle } = useSnootyMetadata();
  const { siteUrl } = useSiteMetadata();

  const parentPathsSlug = parentPaths[slug];

  const queriedCrumbs = useBreadcrumbs();

  const breadcrumbSd = React.useMemo(() => {
    const sd = new BreadcrumbListSd({ siteUrl, siteTitle, slug, queriedCrumbs, parentPaths: parentPathsSlug });
    return sd.isValid() ? sd.toString() : undefined;
  }, [siteUrl, siteTitle, slug, queriedCrumbs, parentPathsSlug]);

  return (
    <>
      {Array.isArray(queriedCrumbs.breadcrumbs) && breadcrumbSd && (
        <script className={STRUCTURED_DATA_CLASSNAME} type="application/ld+json">
          {breadcrumbSd}
        </script>
      )}
    </>
  );
};

BreadcrumbSchema.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default BreadcrumbSchema;
