import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import { getCompleteBreadcrumbData } from '../../utils/get-complete-breadcrumb-data.js';
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import BreadcrumbContainer from './BreadcrumbContainer';

const breadcrumbBodyStyle = css`
  font-size: ${theme.fontSize.small};
  a {
    color: ${palette.gray.dark1};
  }
`;

const Breadcrumbs = ({ siteTitle, slug, defQueriedCrumbs = null, defParentPaths = null, selfCrumbContent = null }) => {
  const queriedCrumbs = defQueriedCrumbs ?? useBreadcrumbs();
  if (!defParentPaths) {
    const { parentPaths } = useSnootyMetadata();
    defParentPaths = parentPaths;
  }
  let parentPaths = defParentPaths;

  const breadcrumbs = React.useMemo(
    () => getCompleteBreadcrumbData({ siteTitle, slug, queriedCrumbs, parentPaths, selfCrumbContent }),
    [parentPaths, queriedCrumbs, siteTitle, slug, selfCrumbContent]
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
