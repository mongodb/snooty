import React from 'react';
import PropTypes from 'prop-types';
import { Body } from '@leafygreen-ui/typography';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { baseUrl } from '../../utils/base-url';
import { theme } from '../../theme/docsTheme';
import BreadcrumbContainer from './BreadcrumbContainer';

const breadcrumbBodyStyle = css`
  font-size: ${theme.fontSize.small};
  a {
    color: ${palette.gray.dark1};
  }
`;

const Breadcrumbs = ({ homeUrl = null, pageTitle = null, siteTitle, slug }) => {
  console.log(slug);
  const homeCrumb = {
    title: 'Docs Home',
    url: homeUrl || baseUrl(),
  };
  // If a pageTitle prop is passed, use that as the last breadcrumb instead
  const propertyCrumb = {
    title: pageTitle || siteTitle,
    url: pageTitle ? slug : '/',
  };

  return (
    <Body className={cx(breadcrumbBodyStyle)}>
      <BreadcrumbContainer homeCrumb={homeCrumb} propertyCrumb={propertyCrumb} slug={slug} />
    </Body>
  );
};

Breadcrumbs.propTypes = {
  homeUrl: PropTypes.string,
  pageTitle: PropTypes.string,
  siteTitle: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default Breadcrumbs;
