import React from 'react';
import PropTypes from 'prop-types';
import { Body } from '@leafygreen-ui/typography';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import BreadcrumbSchema from './BreadcrumbSchema';
import BreadcrumbContainer from './BreadcrumbContainer';
import { baseUrl } from '../../utils/base-url';
import { theme } from '../../theme/docsTheme';

const breadcrumbBodyStyle = css`
  font-size: ${theme.fontSize.small};
  a {
    color: ${palette.gray.dark1};
  }
`;

const Breadcrumbs = ({ homeUrl = null, pageTitle = null, parentPaths, siteTitle, slug }) => {
  const homeCrumb = {
    title: 'Docs Home',
    url: homeUrl || baseUrl(),
  };
  // If a pageTitle prop is passed, use that as the last breadcrumb instead
  const lastCrumb = {
    title: pageTitle || siteTitle,
    url: pageTitle ? slug : '/',
  };

  return (
    <>
      <BreadcrumbSchema breadcrumb={parentPaths} siteTitle={siteTitle} slug={slug} />
      <Body className={cx(breadcrumbBodyStyle)}>
        <BreadcrumbContainer homeCrumb={homeCrumb} lastCrumb={lastCrumb} />
      </Body>
    </>
  );
};

Breadcrumbs.propTypes = {
  homeUrl: PropTypes.string,
  pageTitle: PropTypes.string,
  parentPaths: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      plaintext: PropTypes.string,
      title: PropTypes.arrayOf(PropTypes.object),
    })
  ),
  siteTitle: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default Breadcrumbs;
