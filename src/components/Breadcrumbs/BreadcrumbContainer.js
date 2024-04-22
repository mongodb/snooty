import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { css as LeafyCss, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import Link from '../Link';
import { formatText } from '../../utils/format-text';
import { theme } from '../../theme/docsTheme';
import { reportAnalytics } from '../../utils/report-analytics';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';

const activeColor = css`
  color: ${palette.gray.dark3};
`;

const StyledArrow = styled('span')`
  cursor: default;

  :last-of-type {
    ${activeColor}
  }
`;

const linkStyling = LeafyCss`
  font-size: ${theme.fontSize.small};
  :last-of-type {
    ${activeColor}
  }

  :hover,
  :focus {
    text-decoration: none;

    :not(:last-of-type) {
      ${activeColor}
    }
  }
`;

const BreadcrumbContainer = ({ homeCrumb, propertyCrumb, slug }) => {
  const { parentPaths } = useSnootyMetadata();
  //get base URL to reconstruct url of all the breadcrumbs

  const queriedCrumbs = useBreadcrumbs()[0];
  const propertyUrl = queriedCrumbs.propertyUrl;
  const intermediateCrumbs = queriedCrumbs.breadcrumbs;
  console.log('intermediateCrumbs ' + JSON.stringify(intermediateCrumbs));
  console.log(queriedCrumbs.project);

  //get parents from pathparents here instead
  //add respective url to each breadcrumb
  // console.log("parentPaths" + JSON.stringify(parentPaths));
  const parents = React.useMemo(
    () =>
      parentPaths[slug]
        ? parentPaths[slug].map((crumb) => {
            return { ...crumb, url: propertyUrl + crumb.path };
          })
        : [],
    [parentPaths, slug, propertyUrl]
  );
  console.log('parents' + JSON.stringify(parents));

  // const parents = useNavigationParents(project);
  const breadcrumbs = React.useMemo(
    () => [homeCrumb, ...intermediateCrumbs, propertyCrumb, ...parents],
    [homeCrumb, propertyCrumb, intermediateCrumbs, parents]
  );
  console.log('breadcrumbs' + JSON.stringify(breadcrumbs));

  return (
    <>
      {breadcrumbs.map(({ title, url }, index) => {
        const isFirst = index === 0;
        const renderKey = typeof title === 'string' ? title : title[0]?.value; // could return undefined which is fine, we would still get a unique key
        return (
          <React.Fragment key={`${renderKey}-${index}`}>
            {!isFirst && <StyledArrow> &#8594; </StyledArrow>}
            <Link
              className={cx(linkStyling)}
              to={url}
              onClick={() => {
                reportAnalytics('BreadcrumbClick', {
                  parentPaths: breadcrumbs,
                  breadcrumbClicked: url,
                });
              }}
            >
              {formatText(title)}
            </Link>
          </React.Fragment>
        );
      })}
    </>
  );
};

const crumbObjectShape = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

BreadcrumbContainer.propTypes = {
  homeCrumb: PropTypes.shape(crumbObjectShape).isRequired,
  propertyCrumb: PropTypes.shape(crumbObjectShape).isRequired,
};

export default BreadcrumbContainer;
