import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem } from '@leafygreen-ui/menu';
import IconButton from '@leafygreen-ui/icon-button';
import Icon from '@leafygreen-ui/icon';
import { formatText } from '../../utils/format-text';

const CollapsedBreadcrumbs = ({ crumbs }) => {
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
        {crumbs.map((crumb, index) => (
          <MenuItem key={index} href={crumb.url}>
            {formatText(crumb.title)}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};

const crumbObjectShape = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

CollapsedBreadcrumbs.propTypes = {
  crumbs: PropTypes.arrayOf(PropTypes.shape(crumbObjectShape)).isRequired,
};

export default CollapsedBreadcrumbs;
