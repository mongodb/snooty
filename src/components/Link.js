import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import { Link as LGLink } from '@leafygreen-ui/typography';
import { cx, css } from '@leafygreen-ui/emotion';

/*
 * Note: This component is not suitable for internal page navigation:
 * https://www.gatsbyjs.org/docs/gatsby-link/#recommendations-for-programmatic-in-app-navigation
 */

const LGlinkStyling = css`
  text-decoration: none !important;
`;

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
      <GatsbyLink activeClassName={activeClassName} partiallyActive={partiallyActive} to={to} {...other}>
        {children}
      </GatsbyLink>
    );
  } else if (!anchor && !(to.includes('www.mongodb.com/docs/') || to.match(/docs.*mongodb.com/))) {
    return (
      <LGLink className={cx(LGlinkStyling)} href={to}>
        {children}
      </LGLink>
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
