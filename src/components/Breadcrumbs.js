import React from 'react';
import PropTypes from 'prop-types';
import BreadcrumbSchema from './BreadcrumbSchema';
import Loadable from '@loadable/component';

const BreadcrumbContainer = Loadable(() => import('./BreadcrumbContainer'));

const Breadcrumbs = ({ pageTitle = null, parentPaths, siteTitle, slug }) => {
  // If a pageTitle prop is passed, use that as the last breadcrumb instead
  const lastCrumb = {
    title: pageTitle || siteTitle,
    url: pageTitle ? slug : '/',
  };

  return (
    <>
      <BreadcrumbSchema breadcrumb={parentPaths} siteTitle={siteTitle} slug={slug} />
      <BreadcrumbContainer lastCrumb={lastCrumb} />
    </>
  );
};

Breadcrumbs.propTypes = {
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
