import React from 'react';
import { SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import Link from './Link';
import { formatText } from '../utils/format-text';

const IA = ({ header, ia, pageTitle }) => (
  <SideNavGroup header={header}>
    {ia.map(({ title, slug, url }) => {
      const target = slug || url;
      return (
        <SideNavItem key={target} as={Link} to={target}>
          {formatText(title)}
        </SideNavItem>
      );
    })}
  </SideNavGroup>
);

export default IA;
