import React from 'react';
import styled from '@emotion/styled';
import { reportAnalytics } from '../../utils/report-analytics';
import { theme } from '../../theme/docsTheme';
import { getFullBreadcrumbPath } from '../../utils/get-complete-breadcrumb-data';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

import { currentScrollPosition } from '../../utils/current-scroll-position';
import useScreenSize from '../../hooks/useScreenSize';
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

// Calculate the initial maximum number of breadcrumbs to show based on screen size
const getInitialMaxCrumbs = (breadcrumbs: Array<BreadcrumbType>, isMobile: boolean, isTabletOrMobile: boolean) => {
  if (breadcrumbs.length <= MIN_BREADCRUMBS) {
    // No collapsing needed if we don't have many breadcrumbs
    return breadcrumbs.length + 1;
  }

  if (isMobile) {
    return Math.max(3, breadcrumbs.length);
  }

  if (isTabletOrMobile) {
    return Math.max(4, breadcrumbs.length);
  }

  // Desktop
  return Math.max(6, breadcrumbs.length);
};

export type BreadcrumbType = {
  title: string;
  path: string;
};

const BreadcrumbContainer = ({ breadcrumbs }: { breadcrumbs: Array<BreadcrumbType> }) => {
  const { isMobile, isTabletOrMobile } = useScreenSize();
  const [maxCrumbs, setMaxCrumbs] = React.useState(() => getInitialMaxCrumbs(breadcrumbs, isMobile, isTabletOrMobile));
  const { siteUrl } = useSiteMetadata();

  React.useEffect(() => {
    const handleResize = () => {
      setMaxCrumbs(getInitialMaxCrumbs(breadcrumbs, isMobile, isTabletOrMobile));
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [breadcrumbs, isMobile, isTabletOrMobile]);

  // Our breadcrumbs representation is an array of crumbObjectShape || (array of crumbObjectShape)
  // The latter indicates a collapsed series of breadcrumbs.
  const processedBreadcrumbs: (BreadcrumbType | BreadcrumbType[])[] = React.useMemo(() => {
    if (breadcrumbs.length >= maxCrumbs && breadcrumbs.length > 2) {
      // A maximum of maxCrumbs breadcrumbs may be shown, so we collapse the first run of internal
      // crumbs into a single "…" crumb
      const collapsedCrumbs = Array.from(breadcrumbs).splice(1, breadcrumbs.length - maxCrumbs + 1);
      const processedCrumbs: (BreadcrumbType | BreadcrumbType[])[] = Array.from(breadcrumbs);
      processedCrumbs.splice(1, breadcrumbs.length - maxCrumbs + 1, collapsedCrumbs);
      return processedCrumbs;
    } else {
      return breadcrumbs;
    }
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
                  reportAnalytics('Click', {
                    position: 'body',
                    position_context: 'breadcrumb',
                    label: getFullBreadcrumbPath(siteUrl, crumb.path, true),
                    scroll_position: currentScrollPosition(),
                    tagbook: 'true',
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

export default BreadcrumbContainer;
