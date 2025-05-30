import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import { getCompleteBreadcrumbData } from '../../utils/get-complete-breadcrumb-data.ts';
import { QueriedCrumbs, useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import BreadcrumbContainer from './BreadcrumbContainer';

const breadcrumbBodyStyle = css`
  font-size: ${theme.fontSize.small};
  --breadcrumb-color: ${palette.gray.dark1};
  .dark-theme & {
    --breadcrumb-color: ${palette.gray.light1};
  }

  a,
  span {
    color: var(--breadcrumb-color);
  }
`;

export type PageInfo = {
  project: string;
  urlSlug: string;
  siteBasePrefix: string;
};

export type BreadcrumbsProps = {
  siteTitle: string;
  slug: string;
  queriedCrumbsProp?: QueriedCrumbs;
  parentPathsProp?: string[];
  selfCrumb?: { title: string; slug: string };
  pageInfo?: PageInfo;
};

const Breadcrumbs = ({
  siteTitle,
  slug,
  queriedCrumbsProp,
  parentPathsProp,
  selfCrumb,
  pageInfo,
}: BreadcrumbsProps) => {
  const queriedCrumbsHook = useBreadcrumbs();
  const queriedCrumbs = queriedCrumbsProp ?? queriedCrumbsHook;

  const { parentPaths } = useSnootyMetadata();
  const parentPathsData = parentPathsProp ?? parentPaths[slug];

  const { siteUrl } = useSiteMetadata();
  const breadcrumbs = React.useMemo(
    () =>
      getCompleteBreadcrumbData({
        siteUrl,
        siteTitle,
        slug,
        queriedCrumbs,
        parentPaths: parentPathsData,
        selfCrumbContent: selfCrumb,
        pageInfo,
      }),
    [siteUrl, parentPathsData, queriedCrumbs, siteTitle, slug, selfCrumb, pageInfo]
  );

  return (
    <div className={cx(breadcrumbBodyStyle)}>
      <BreadcrumbContainer breadcrumbs={breadcrumbs} />
    </div>
  );
};

export default Breadcrumbs;
