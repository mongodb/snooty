import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import { getCompleteBreadcrumbData } from '../../utils/get-complete-breadcrumb-data';
import { QueriedCrumbs, useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { useUnifiedToc } from '../../hooks/use-unified-toc';
import { getFeatureFlags } from '../../utils/feature-flags';
import { usePageBreadcrumbs } from '../../hooks/useCreateBreadCrumbs';
import BreadcrumbContainer, { BreadcrumbType } from './BreadcrumbContainer';

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

export type BreadcrumbInfoLocalStorage = {
  parentPathsSlug: BreadcrumbType[];
  queriedCrumbs: QueriedCrumbs;
  siteTitle: string;
  slug: any;
  pageTitle: string;
};

export type SelfCrumb = {
  title: string;
  slug: string;
};

export type BreadcrumbsProps = {
  siteTitle: string;
  slug: string;
  queriedCrumbsProp?: QueriedCrumbs;
  parentPathsProp?: BreadcrumbType[];
  selfCrumb?: SelfCrumb;
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
  const { isUnifiedToc } = getFeatureFlags();
  const tocTree = useUnifiedToc();
  const queriedCrumbsHook = useBreadcrumbs();
  const queriedCrumbs = queriedCrumbsProp ?? queriedCrumbsHook;

  const { parentPaths } = useSnootyMetadata();

  const unifiedTocParents = usePageBreadcrumbs(tocTree, slug, isUnifiedToc);

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
        unifiedTocParents,
      }),
    [siteUrl, parentPathsData, queriedCrumbs, siteTitle, slug, selfCrumb, pageInfo, unifiedTocParents]
  );

  return (
    <div className={cx(breadcrumbBodyStyle)}>
      <BreadcrumbContainer breadcrumbs={breadcrumbs} />
    </div>
  );
};

export default Breadcrumbs;
