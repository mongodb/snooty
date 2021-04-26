import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Loadable from '@loadable/component';
import BreadcrumbSchema from './BreadcrumbSchema';

const BreadcrumbContainer = Loadable(() => import('./BreadcrumbContainer'));

// Placeholder space for breadcrumbs before they load; add extra space due to negative
// margin-top of page's h1
const Wrapper = styled('div')`
  min-height: 48px;
`;

const Breadcrumbs = ({ homeUrl = null, pageTitle = null, parentPaths, siteTitle, slug }) => {
  const homeCrumb = {
    title: 'Docs Home',
    url: homeUrl || 'https://docs.mongodb.com/',
  };
  // If a pageTitle prop is passed, use that as the last breadcrumb instead
  const lastCrumb = {
    title: pageTitle || siteTitle,
    url: pageTitle ? slug : '/',
  };

  return (
    <>
      <BreadcrumbSchema breadcrumb={parentPaths} siteTitle={siteTitle} slug={slug} />
      <Wrapper>
        <BreadcrumbContainer homeCrumb={homeCrumb} lastCrumb={lastCrumb} />
      </Wrapper>
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
