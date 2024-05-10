import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem } from '@leafygreen-ui/menu';
import IconButton from '@leafygreen-ui/icon-button';
import { withPrefix } from 'gatsby';
import { useLocation } from '@gatsbyjs/reach-router';
import Icon from '@leafygreen-ui/icon';
import { formatText } from '../../utils/format-text';
import { isGatsbyPreview } from '../../utils/is-gatsby-preview';
import { getGatsbyPreviewLink } from '../../utils/get-gatsby-preview-link';

const CollapsedBreadcrumbs = ({ crumbs }) => {
  const location = useLocation();

  const menuItems = crumbs.map((crumb, index) => {
    let to = withPrefix(crumb.path);
    if (isGatsbyPreview()) to = getGatsbyPreviewLink(to, location);

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

const crumbObjectShape = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

CollapsedBreadcrumbs.propTypes = {
  crumbs: PropTypes.arrayOf(PropTypes.shape(crumbObjectShape)).isRequired,
};

export default CollapsedBreadcrumbs;
