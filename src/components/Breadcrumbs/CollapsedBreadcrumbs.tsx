import React from 'react';
import { Menu, MenuItem } from '@leafygreen-ui/menu';
import IconButton from '@leafygreen-ui/icon-button';
import { withPrefix } from 'gatsby';
import Icon from '@leafygreen-ui/icon';
import { formatText } from '../../utils/format-text';
import { BreadcrumbType } from './BreadcrumbContainer';

const CollapsedBreadcrumbs = ({ crumbs }: { crumbs: BreadcrumbType[] }) => {
  const menuItems = crumbs.map((crumb, index) => {
    const to = withPrefix(crumb.path);

    return (
      <MenuItem key={index} href={to}>
        {formatText(crumb.title)}
      </MenuItem>
    );
  });

  return (
    <React.Fragment>
      <Menu
        align="bottom"
        justify="start"
        trigger={
          <IconButton aria-label="Show all breadcrumbs">
            <Icon glyph="Ellipsis" />
          </IconButton>
        }
      >
        {menuItems}
      </Menu>
    </React.Fragment>
  );
};

export default CollapsedBreadcrumbs;
