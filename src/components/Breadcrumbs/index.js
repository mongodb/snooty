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

// THIS ALL NEEDS TO BE CHANGED ...

const Breadcrumbs = ({ siteTitle, slug, defQueriedCrumbs = null, defParentPaths = null }) => {
  console.log('USE BREADCRUMBS', useBreadcrumbs());
  const queriedCrumbs = defQueriedCrumbs ?? useBreadcrumbs();
  console.log('DEF QUERIED CRUMBS', defQueriedCrumbs);
  console.log('QUERIEDCRUMBS', queriedCrumbs);
  //console.log('QUERIEDCURMBS', queriedCrumbs);
  //const uwu = useSnootyMetadata();
  //console.log(uwu);useSnootyMetadata();
  if (!defParentPaths) {
    console.log('USING NATIVE PARENT PATHS');
    const { parentPaths } = useSnootyMetadata();
    defParentPaths = parentPaths;
  }
  let parentPaths = defParentPaths;
  console.log('PARENTPATHS', parentPaths);

  const breadcrumbs = React.useMemo(
    () => getCompleteBreadcrumbData({ siteTitle, slug, queriedCrumbs, parentPaths }),
    [parentPaths, queriedCrumbs, siteTitle, slug]
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
