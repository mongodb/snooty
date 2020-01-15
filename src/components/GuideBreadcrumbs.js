import React from 'react';
import Link from './Link';
// eslint-disable-next-line import/no-unresolved
import { useSiteMetadata } from 'useSiteMetadata'; // Alias in webpack.config

const GuideBreadcrumbs = () => {
  const { title } = useSiteMetadata();
  return (
    <ul className="breadcrumbs">
      <li className="breadcrumbs__bc">
        <Link to="/">{title}</Link> &gt;{' '}
      </li>
    </ul>
  );
};

export default GuideBreadcrumbs;
