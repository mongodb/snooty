import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import { Link as LGLink } from '@leafygreen-ui/typography';
import { cx, css } from '@leafygreen-ui/emotion';
import { isRelativeUrl } from '../utils/is-relative-url';
import { palette } from '@leafygreen-ui/palette';
import styled from '@emotion/styled';
import ArrowRightIcon from '@leafygreen-ui/icon/dist/ArrowRight';

/*
 * Note: This component is not suitable for internal page navigation:
 * https://www.gatsbyjs.org/docs/gatsby-link/#recommendations-for-programmatic-in-app-navigation
 */

const LGlinkStyling = css`
  text-decoration: none !important;
`;

// CSS purloined from LG Link definition (source: https://bit.ly/3JpiPIt)
const StyledGatsbyLink = styled(GatsbyLink)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  line-height: 13px;
  &:focus {
    outline: none;
  }
  position: relative;
  text-decoration: none !important;
  line-height: 13px;
  outline: none;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -4px;
    left: 0;
    border-radius: 2px;
  }
  &:focus & {
    &::after {
      background-color: ${palette.blue.light1};
    }
  }
  &:hover {
    &::after {
      background-color: ${palette.gray.light2};
    }
  }
`;

// Since DOM elements <a> cannot receive activeClassName and partiallyActive,
// destructure the prop here and pass it only to GatsbyLink.
const Link = ({ children, to, activeClassName, partiallyActive, showLinkArrow, ...other }) => {
  if (!to) to = '';
  const anchor = to.startsWith('#');

  // Use Gatsby Link for internal links, and <a> for others
  if (to && isRelativeUrl(to) && !anchor) {
    if (!to.startsWith('/')) to = `/${to}`;

    // Ensure trailing slash
    to = to.replace(/\/?(\?|#|$)/, '/$1');

    const decoration = showLinkArrow ? <ArrowRightIcon role="presentation" size={12} /> : '';

    return (
      <StyledGatsbyLink activeClassName={activeClassName} partiallyActive={partiallyActive} to={to} {...other}>
        {children}
        {decoration}
      </StyledGatsbyLink>
    );
  }
  const hideExternalIcon =
    !anchor && !(to.includes('www.mongodb.com/docs/') || to.match(/docs.*mongodb.com/)) ? false : true;
  return (
    <LGLink className={cx(LGlinkStyling)} href={to} hideExternalIcon={hideExternalIcon} {...other}>
      {children}
    </LGLink>
  );
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
};

export default Link;
