import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import { getCompleteBreadcrumbData } from '../../utils/get-complete-breadcrumb-data.js';
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { useSiteMetadata } from '../../hooks/use-site-metadata.js';
import { useUnifiedToc } from '../../hooks/use-unified-toc';
import { getFeatureFlags } from '../../utils/feature-flags';
import { usePageBreadcrumbs } from '../../hooks/useCreateBreadCrumbs';
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

const Breadcrumbs = ({
  siteTitle,
  slug,
  queriedCrumbsProp = null,
  parentPathsProp = null,
  selfCrumb = null,
  pageInfo = null,
}) => {
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

Breadcrumbs.propTypes = {
  homeUrl: PropTypes.string,
  pageTitle: PropTypes.string,
  siteTitle: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default Breadcrumbs;
