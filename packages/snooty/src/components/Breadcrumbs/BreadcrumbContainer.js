import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { reportAnalytics } from '../../utils/report-analytics';
import { theme } from '../../theme/docsTheme';
import { getFullBreadcrumbPath } from '../../utils/get-complete-breadcrumb-data';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import IndividualBreadcrumb from './IndividualBreadcrumb';
import CollapsedBreadcrumbs from './CollapsedBreadcrumbs';

const StyledSlash = styled('span')`
  cursor: default;
  padding-left: ${theme.size.small};
  padding-right: ${theme.size.small};
`;

const Flexbox = styled('div')`
  display: flex;
  align-items: center;
`;

const MIN_BREADCRUMBS = 3;
const initialMaxCrumbs = (breadcrumbs) => breadcrumbs.length + 1;

const BreadcrumbContainer = ({ breadcrumbs }) => {
  const [maxCrumbs, setMaxCrumbs] = React.useState(initialMaxCrumbs(breadcrumbs));
  const { siteUrl } = useSiteMetadata();

  React.useEffect(() => {
    const handleResize = () => {
      setMaxCrumbs(initialMaxCrumbs(breadcrumbs));
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [breadcrumbs]);

  // Our breadcrumbs representation is an array of crumbObjectShape || (array of crumbObjectShape)
  // The latter indicates a collapsed series of breadcrumbs.
  const processedBreadcrumbs = React.useMemo(() => {
    const crumbsCopy = Array.from(breadcrumbs);
    if (crumbsCopy.length >= maxCrumbs && crumbsCopy.length > 2) {
      // A maximum of maxCrumbs breadcrumbs may be shown, so we collapse the first run of internal
      // crumbs into a single "…" crumb
      const collapsedCrumbs = crumbsCopy.splice(1, breadcrumbs.length - maxCrumbs + 1, []);
      crumbsCopy[1] = collapsedCrumbs;
    }
    return crumbsCopy;
  }, [maxCrumbs, breadcrumbs]);

  const collapseBreadcrumbs = () => {
    const newMaxCrumbs = Math.max(maxCrumbs - 1, MIN_BREADCRUMBS);
    setMaxCrumbs(newMaxCrumbs);
  };

  return (
    <Flexbox>
      {processedBreadcrumbs.map((crumb, index) => {
        const isFirst = index === 0;
        return (
          <React.Fragment key={index}>
            {!isFirst && <StyledSlash> / </StyledSlash>}
            {Array.isArray(crumb) ? (
              <CollapsedBreadcrumbs crumbs={crumb}></CollapsedBreadcrumbs>
            ) : (
              <IndividualBreadcrumb
                key={crumb.title}
                crumb={crumb}
                setIsExcessivelyTruncated={collapseBreadcrumbs}
                onClick={() =>
                  reportAnalytics('BreadcrumbClick', {
                    breadcrumbClicked: getFullBreadcrumbPath(siteUrl, crumb.path, true),
                  })
                }
              ></IndividualBreadcrumb>
            )}
          </React.Fragment>
        );
      })}
    </Flexbox>
  );
};

const crumbObjectShape = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

BreadcrumbContainer.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape(crumbObjectShape)).isRequired,
};

export default BreadcrumbContainer;
