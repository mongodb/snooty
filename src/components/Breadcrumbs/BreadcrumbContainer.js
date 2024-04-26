import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { reportAnalytics } from '../../utils/report-analytics';
import { useNavigationParents } from '../../hooks/use-navigation-parents';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import useScreenSize from '../../hooks/useScreenSize';
import IndividualBreadcrumb from './IndividualBreadcrumb';
import CollapsedBreadcrumbs from './CollapsedBreadcrumbs';

const StyledSlash = styled('span')`
  cursor: default;
  padding-left: 4px;
  padding-right: 4px;
`;

const Flexbox = styled('span')`
  display: flex;
`;

const BreadcrumbContainer = ({ homeCrumb, lastCrumb }) => {
  const { project } = useSnootyMetadata();
  const parents = useNavigationParents(project);

  // On mobile, we collapse all of the breadcrumbs between the first and the last
  const { isMobile } = useScreenSize();
  const maxCrumbs = isMobile ? 3 : 5;

  // Our breadcrumbs representation is an array of crumbObjectShape || (array of crumbObjectShape)
  // The latter indicates a collapsed series of breadcrumbs.
  const breadcrumbs = React.useMemo(() => {
    const crumbs = [homeCrumb, ...parents, lastCrumb];
    if (crumbs.length > maxCrumbs) {
      // A maximum of maxCrumbs breadcrumbs may be shown, so we collapse the first run of internal
      // crumbs into a single "…" crumb
      const collapsedCrumbs = crumbs.splice(1, crumbs.length - maxCrumbs + 1, []);
      crumbs[1] = collapsedCrumbs;
    }
    return crumbs;
  }, [maxCrumbs, homeCrumb, parents, lastCrumb]);

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
