import React from 'react';
import { withPrefix } from 'gatsby';
// eslint-disable-next-line import/no-unresolved
import { useSiteMetadata } from 'useSiteMetadata'; // Alias in webpack.config

const GuideBreadcrumbs = () => {
  const { title } = useSiteMetadata();
  return (
    <ul className="breadcrumbs">
      <li className="breadcrumbs__bc">
        <a href={withPrefix('/')}>{title}</a> &gt;{' '}
      </li>
    </ul>
  );
};

export default GuideBreadcrumbs;
