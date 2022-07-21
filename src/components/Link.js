import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Link as GatsbyLink } from 'gatsby';
import { Link as LGLink } from '@leafygreen-ui/typography';
import { cx, css } from '@leafygreen-ui/emotion';
import { isRelativeUrl } from '../utils/is-relative-url';
import { palette } from '@leafygreen-ui/palette';

/*
 * Note: This component is not suitable for internal page navigation:
 * https://www.gatsbyjs.org/docs/gatsby-link/#recommendations-for-programmatic-in-app-navigation
 */

const LGlinkStyling = css`
  text-decoration: none !important;
`;

const StyledGatsbyLink = styled(GatsbyLink)`
  //somehow just make this be styled the same as a LGLink
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  line-height: 13px;
  &:focus {
    outline: none;
  }
  color: ${palette.blue.base};
  font-weight: 400;
`;

const StyledLink = css`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  line-height: 13px;
  &:focus {
    outline: none;
  }
  color: ${palette.blue.base};
  font-weight: 400;
`;

// Since DOM elements <a> cannot receive activeClassName and partiallyActive,
// destructure the prop here and pass it only to GatsbyLink.
const Link = ({ children, to, activeClassName, partiallyActive, ...other }) => {
  if (!to) to = '';
  const anchor = to.startsWith('#');

  // Use Gatsby Link for internal links, and <a> for others
  if (to && isRelativeUrl(to) && !anchor) {
    if (!to.startsWith('/')) to = `/${to}`;

    // Ensure trailing slash
    to = to.replace(/\/?(\?|#|$)/, '/$1');

    return (
      <StyledGatsbyLink activeClassName={activeClassName} partiallyActive={partiallyActive} to={to} {...other}>
        {children}
      </StyledGatsbyLink>
    );
  } else if (!anchor && !(to.includes('www.mongodb.com/docs/') || to.match(/docs.*mongodb.com/))) {
    return (
      <LGLink className={cx(LGlinkStyling)} href={to} {...other}>
        {children}
      </LGLink>
    );
  }
  return (
    <a className={StyledLink} href={to} {...other}>
      {children}
    </a>
  );
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
};

export default Link;
