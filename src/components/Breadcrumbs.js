import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import BreadcrumbSchema from './BreadcrumbSchema';
import { theme } from '../theme/docsTheme';
import BreadcrumbContainer from './BreadcrumbContainer';

const Wrapper = styled('nav')`
  font-size: ${theme.fontSize.small};

  * {
    color: ${uiColors.gray.dark1};
  }

  & > p {
    margin-top: 0;
    min-height: ${theme.size.medium};
  }
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
        <p>
          <BreadcrumbContainer homeCrumb={homeCrumb} lastCrumb={lastCrumb} />
        </p>
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
