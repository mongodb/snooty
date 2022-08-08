import React from 'react';
import PropTypes from 'prop-types';
import BreadcrumbSchema from './BreadcrumbSchema';
import BreadcrumbContainer from './BreadcrumbContainer';
import { Body } from '@leafygreen-ui/typography';
import { baseUrl } from '../../utils/base-url';

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
      <Body>
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
