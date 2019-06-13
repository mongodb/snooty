import React from 'react';
import { withPrefix } from 'gatsby';
import { useSiteMetadata } from '../hooks/use-site-metadata';

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
