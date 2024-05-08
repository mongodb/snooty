import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from '@gatsbyjs/reach-router';
import { Link as GatsbyLink } from 'gatsby';
import { css } from '@leafygreen-ui/emotion';
import { Link as LGLink } from '@leafygreen-ui/typography';
import { palette } from '@leafygreen-ui/palette';
import ArrowRightIcon from '@leafygreen-ui/icon/dist/ArrowRight';
import { isRelativeUrl } from '../utils/is-relative-url';
import { joinClassNames } from '../utils/join-class-names';
import { isGatsbyPreview } from '../utils/is-gatsby-preview';
import { validateHTMAttributes } from '../utils/validate-element-attributes';

/*
 * Note: This component is not suitable for internal page navigation:
 * https://www.gatsbyjs.org/docs/gatsby-link/#recommendations-for-programmatic-in-app-navigation
 */

// CSS purloined from LG Link definition (source: https://bit.ly/3JpiPIt)
const gatsbyLinkStyling = css`
  align-items: center;
  cursor: pointer;
  position: relative;
  text-decoration: none;
  text-decoration-color: transparent;
  line-height: 13px;
  color: ${palette.blue.base};

  > code {
    color: ${palette.blue.base};
  }

  &:focus,
  &:hover {
    text-decoration-line: underline;
    transition: text-decoration 150ms ease-in-out;
    text-underline-offset: 4px;
    text-decoration-thickness: 2px;
  }
  &:focus {
    text-decoration-color: ${palette.blue.base};
    outline: none;
  }
  &:hover {
    text-decoration-color: ${palette.gray.light2};
  }
`;

// DOP-3091: LG anchors are not inline by default
const lgLinkStyling = css`
  display: inline;
`;

// Since DOM elements <a> cannot receive activeClassName and partiallyActive,
// destructure the prop here and pass it only to GatsbyLink.
const Link = ({
  children,
  to,
  activeClassName,
  className,
  partiallyActive,
  showLinkArrow,
  hideExternalIcon: hideExternalIconProp,
  isBreadcrumb,
  ...other
}) => {
  const location = useLocation();
  if (!to) to = '';
  const anchor = to.startsWith('#');

  const anchorProps = validateHTMAttributes('anchor', other);

  //used instead of LG showLinkArrow prop for consistency between LGLinks and GatsbyLinks(GatsbyLinks don't have that prop)
  const decoration = showLinkArrow ? (
    <span>
      {' '}
      <ArrowRightIcon role="presentation" size={12} />{' '}
    </span>
  ) : (
    ''
  );

  // Use Gatsby Link for internal links, and <a> for others
  if (to && isRelativeUrl(to) && !anchor) {
    if (!to.startsWith('/')) to = `/${to}`;

    // Ensure trailing slash
    to = to.replace(/\/?(\?|#|$)/, '/$1');

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
      <GatsbyLink
        className={joinClassNames(gatsbyLinkStyling, className)}
        activeClassName={activeClassName}
        partiallyActive={partiallyActive}
        to={to}
        {...anchorProps}
      >
        {children}
        {decoration}
      </GatsbyLink>
    );
  }

  const strippedUrl = to?.replace(/(^https:\/\/)|(www\.)/g, '');
  const isMDBLink = strippedUrl.includes('mongodb.com');
  const showExtIcon = !anchor && !isMDBLink;
  const target = !showExtIcon ? '_self' : undefined;

  return (
    <LGLink
      className={joinClassNames(lgLinkStyling, className)}
      href={to}
      hideExternalIcon={!showExtIcon}
      target={target}
      {...anchorProps}
    >
      {children}
      {decoration}
    </LGLink>
  );
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
};

export default Link;
