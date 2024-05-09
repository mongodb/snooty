import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem } from '@leafygreen-ui/menu';
import IconButton from '@leafygreen-ui/icon-button';
import { withPrefix } from 'gatsby';
import { useLocation } from '@gatsbyjs/reach-router';
import Icon from '@leafygreen-ui/icon';
import { formatText } from '../../utils/format-text';
import { isGatsbyPreview } from '../../utils/is-gatsby-preview';

const CollapsedBreadcrumbs = ({ crumbs }) => {
  const location = useLocation();

  const menuItems = crumbs.map((crumb, index) => {
    let to = withPrefix(crumb.path);
    if (isGatsbyPreview()) {
      // If we're in preview mode, we build the pages of each project and branch of the site within
      // its own namespace so each author can preview their own pages e.g.
      // /project1/branch1/doc-path
      // /project2/branch2/doc-path
      //
      // So to navigate with the namespaced site, we add to each link the current project and branch
      // the user is browsing in.
      const projectAndBranchPrefix = `/` + location.pathname.split(`/`).slice(1, 3).join(`/`);
      if (!to.startsWith(projectAndBranchPrefix)) {
        to = projectAndBranchPrefix + to;
      }
    }

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
