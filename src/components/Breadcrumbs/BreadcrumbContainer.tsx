import React from 'react';
import styled from '@emotion/styled';
import { reportAnalytics } from '../../utils/report-analytics';
import { theme } from '../../theme/docsTheme';
import { getFullBreadcrumbPath } from '../../utils/get-complete-breadcrumb-data';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

import { currentScrollPosition } from '../../utils/current-scroll-position';
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

const MobileBreadcrumbs = styled(Flexbox)`
  @media ${theme.screenSize.upToSmall} {
    display: flex;
  }

  @media ${theme.screenSize.smallAndUp} {
    display: none;
  }
`;

const TabletBreadcrumbs = styled(Flexbox)`
  @media ${theme.screenSize.upToSmall} {
    display: none;
  }

  @media ${theme.screenSize.smallAndUp} {
    display: flex;
  }

  @media ${theme.screenSize.largeAndUp} {
    display: none;
  }
`;

const DesktopBreadcrumbs = styled(Flexbox)`
  @media ${theme.screenSize.upToLarge} {
    display: none;
  }

  @media ${theme.screenSize.largeAndUp} {
    display: flex;
  }
`;

const MIN_BREADCRUMBS = 3;

const createCollapsedBreadcrumbs = (
  breadcrumbs: Array<BreadcrumbType>,
  maxVisible: number
): (BreadcrumbType | BreadcrumbType[])[] => {
  if (breadcrumbs.length <= MIN_BREADCRUMBS || breadcrumbs.length <= maxVisible) {
    return breadcrumbs;
  }

  const collapsedCrumbs = Array.from(breadcrumbs).splice(1, breadcrumbs.length - maxVisible + 1);
  const processedCrumbs: (BreadcrumbType | BreadcrumbType[])[] = Array.from(breadcrumbs);
  processedCrumbs.splice(1, breadcrumbs.length - maxVisible + 1, collapsedCrumbs);
  return processedCrumbs;
};

export type BreadcrumbType = {
  title: string;
  path: string;
};

const BreadcrumbContainer = ({ breadcrumbs }: { breadcrumbs: Array<BreadcrumbType> }) => {
  const { siteUrl } = useSiteMetadata();

  // Create different breadcrumb versions for different screen sizes
  const mobileBreadcrumbs = React.useMemo(() => createCollapsedBreadcrumbs(breadcrumbs, 3), [breadcrumbs]);
  const tabletBreadcrumbs = React.useMemo(() => createCollapsedBreadcrumbs(breadcrumbs, 4), [breadcrumbs]);
  const desktopBreadcrumbs = React.useMemo(() => createCollapsedBreadcrumbs(breadcrumbs, 6), [breadcrumbs]);

  const renderBreadcrumbs = (processedBreadcrumbs: (BreadcrumbType | BreadcrumbType[])[]) => {
    return processedBreadcrumbs.map((crumb, index) => {
      const isFirst = index === 0;
      return (
        <React.Fragment key={`${index}-${Array.isArray(crumb) ? 'collapsed' : crumb.title}`}>
          {!isFirst && <StyledSlash> / </StyledSlash>}
          {Array.isArray(crumb) ? (
            <CollapsedBreadcrumbs crumbs={crumb} />
          ) : (
            <IndividualBreadcrumb
              crumb={crumb}
              onClick={() =>
                reportAnalytics('Click', {
                  position: 'body',
                  position_context: 'breadcrumb',
                  label: getFullBreadcrumbPath(siteUrl, crumb.path, true),
                  scroll_position: currentScrollPosition(),
                  tagbook: 'true',
                })
              }
            />
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <MobileBreadcrumbs>{renderBreadcrumbs(mobileBreadcrumbs)}</MobileBreadcrumbs>

      <TabletBreadcrumbs>{renderBreadcrumbs(tabletBreadcrumbs)}</TabletBreadcrumbs>

      <DesktopBreadcrumbs>{renderBreadcrumbs(desktopBreadcrumbs)}</DesktopBreadcrumbs>
    </>
  );
};

export default BreadcrumbContainer;
