import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { reportAnalytics } from '../../utils/report-analytics';
import { useNavigationParents } from '../../hooks/use-navigation-parents';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { theme } from '../../theme/docsTheme';
import IndividualBreadcrumb from './IndividualBreadcrumb';
import CollapsedBreadcrumbs from './CollapsedBreadcrumbs';

const StyledSlash = styled('span')`
  cursor: default;
  padding-left: ${theme.size.small};
  padding-right: ${theme.size.small};
`;

const Flexbox = styled('span')`
  display: flex;
`;

const MIN_BREADCRUMBS = 3;

const BreadcrumbContainer = ({ homeCrumb, lastCrumb }) => {
  const { project } = useSnootyMetadata();
  const parents = useNavigationParents(project);

  // On mobile, we collapse all of the breadcrumbs between the first and the last
  const crumbs = React.useMemo(() => {
    return [homeCrumb, ...parents, lastCrumb];
  }, [homeCrumb, parents, lastCrumb]);

  const [maxCrumbs, setMaxCrumbs] = React.useState(crumbs.length);

  React.useEffect(() => {
    const handleResize = () => {
      setMaxCrumbs(crumbs.length + 1);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [crumbs.length]);

  // Our breadcrumbs representation is an array of crumbObjectShape || (array of crumbObjectShape)
  // The latter indicates a collapsed series of breadcrumbs.
  const breadcrumbs = React.useMemo(() => {
    const crumbsCopy = Array.from(crumbs);
    if (crumbsCopy.length >= maxCrumbs && crumbsCopy.length > 2) {
      // A maximum of maxCrumbs breadcrumbs may be shown, so we collapse the first run of internal
      // crumbs into a single "…" crumb
      const collapsedCrumbs = crumbsCopy.splice(1, crumbs.length - maxCrumbs + 1, []);
      crumbsCopy[1] = collapsedCrumbs;
    }
    return crumbsCopy;
  }, [maxCrumbs, crumbs]);

  const collapseBreadcrumbs = () => {
    const newMaxCrumbs = Math.max(maxCrumbs - 1, MIN_BREADCRUMBS);
    setMaxCrumbs(newMaxCrumbs);
  };

  return (
    <Flexbox>
      {breadcrumbs.map((crumb, index) => {
        const isFirst = index === 0;
        return (
          <React.Fragment key={index}>
            {!isFirst && <StyledSlash> / </StyledSlash>}
            {Array.isArray(crumb) ? (
              <CollapsedBreadcrumbs crumbs={crumb}></CollapsedBreadcrumbs>
            ) : (
              <IndividualBreadcrumb
                crumb={crumb}
                setIsExcessivelyTruncated={collapseBreadcrumbs}
                onClick={() =>
                  reportAnalytics('BreadcrumbClick', {
                    breadcrumbClicked: crumb.url,
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
  url: PropTypes.string.isRequired,
};

BreadcrumbContainer.propTypes = {
  homeCrumb: PropTypes.shape(crumbObjectShape).isRequired,
  lastCrumb: PropTypes.shape(crumbObjectShape).isRequired,
};

export default BreadcrumbContainer;
