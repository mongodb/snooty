import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';

/*
 * Note: This component is not suitable for internal page navigation:
 * https://www.gatsbyjs.org/docs/gatsby-link/#recommendations-for-programmatic-in-app-navigation
 */

// Allows scrolling to top of main "content" div. Replace or remove this in the event we stray away from
// current layout and/or change the div className, etc.
const handleLinkClick = () => {
  const contentEl = document.querySelector('.content');
  if (contentEl) {
    contentEl.scrollTop = 0;
  }
};

// Since DOM elements <a> cannot receive activeClassName and partiallyActive,
// destructure the prop here and pass it only to GatsbyLink.
const Link = ({ children, to, activeClassName, partiallyActive, ...other }) => {
  if (!to) to = '';
  // Assume that external links begin with http:// or https://
  const external = /^http(s)?:\/\//.test(to) || to.startsWith('mailto:');
  const anchor = to.startsWith('#');

  // Use Gatsby Link for internal links, and <a> for others
  if (to && !external && !anchor) {
    if (!to.startsWith('/')) to = `/${to}`;

    // Ensure trailing slash
    to = to.replace(/\/?(\?|#|$)/, '/$1');

    return (
      <GatsbyLink
        activeClassName={activeClassName}
        onClick={handleLinkClick}
        partiallyActive={partiallyActive}
        to={to}
        {...other}
      >
        {children}
      </GatsbyLink>
    );
  }
  return (
    <a href={to} {...other}>
      {children}
    </a>
  );
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
};

export default Link;
