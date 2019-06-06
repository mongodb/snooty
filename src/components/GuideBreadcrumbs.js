import React from 'react';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { getPathPrefix } from '../utils/get-path-prefix';

const GuideBreadcrumbs = () => {
  const { title } = useSiteMetadata();
  return (
    <ul className="breadcrumbs">
      <li className="breadcrumbs__bc">
        <a href={`${getPathPrefix()}/`}>{title}</a> &gt;{' '}
      </li>
    </ul>
  );
};

export default GuideBreadcrumbs;
