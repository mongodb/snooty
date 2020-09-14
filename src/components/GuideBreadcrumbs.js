import React from 'react';
import Link from './Link';
import { useSiteMetadata } from '../hooks/use-site-metadata';

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
