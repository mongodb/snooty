import React, { ReactNode } from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { css, cx } from '@leafygreen-ui/emotion';
import { Link as LGLink } from '@leafygreen-ui/typography';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
// @ts-ignore
import ArrowRightIcon from '@leafygreen-ui/icon/dist/ArrowRight';
import Icon from '@leafygreen-ui/icon';
import { isRelativeUrl } from '../utils/is-relative-url';
import { joinClassNames } from '../utils/join-class-names';
import { validateHTMAttributes } from '../utils/validate-element-attributes';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { assertLeadingAndTrailingSlash } from '../utils/assert-trailing-and-leading-slash';
/*
 * Note: This component is not suitable for internal page navigation:
 * https://www.gatsbyjs.org/docs/gatsby-link/#recommendations-for-programmatic-in-app-navigation
 */

type LinkThemeStyle = {
  color: string;
  focusTextDecorColor: string;
  hoverTextDecorColor: string;
  fontWeight: string | number;
};

type LinkThemeStyles = { light: LinkThemeStyle; dark: LinkThemeStyle };

const THEME_STYLES: LinkThemeStyles = {
  light: {
    color: palette.blue.base,
    focusTextDecorColor: palette.blue.base,
    hoverTextDecorColor: palette.gray.light2,
    fontWeight: 'inherit',
  },
  dark: {
    color: palette.blue.light1,
    focusTextDecorColor: palette.blue.light1,
    hoverTextDecorColor: palette.gray.dark2,
    fontWeight: 700,
  },
};

export const sharedDarkModeOverwriteStyles = `
  color: var(--link-color-primary);
  font-weight: var(--link-font-weight);
`;

const symLinkStyling = css`
  display: inline;
  svg {
    transform: rotate(-45deg);
    margin-left: 7px;
    margin-bottom: -3px;
    width: 13px;
    height: 13px;
    opacity: 1;
  }
`;

const externalNavLinks = css`
  svg {
    margin-left: 8px;
    margin-bottom: -10px;
    color: ${palette.gray.base};
  }
`;

/**
 * CSS purloined from LG Link definition (source: https://bit.ly/3JpiPIt)
 * @param {ThemeStyle} linkThemeStyle
 */
const gatsbyLinkStyling = (linkThemeStyle: LinkThemeStyle) => css`
  align-items: center;
  cursor: pointer;
  position: relative;
  text-decoration: none;
  text-decoration-color: transparent;
  line-height: 13px;
  ${sharedDarkModeOverwriteStyles}

  > span > code, > code {
    ${sharedDarkModeOverwriteStyles}
  }

  &:focus,
  &:hover {
    text-decoration-line: underline;
    transition: text-decoration 150ms ease-in-out;
    text-underline-offset: 4px;
    text-decoration-thickness: 2px;
  }
  &:focus {
    text-decoration-color: ${linkThemeStyle.focusTextDecorColor};
    outline: none;
  }
  &:hover {
    text-decoration-color: ${linkThemeStyle.hoverTextDecorColor};
  }
`;

// DOP-3091: LG anchors are not inline by default
const lgLinkStyling = css`
  display: inline;
  ${sharedDarkModeOverwriteStyles}

  > span > code, > code {
    ${sharedDarkModeOverwriteStyles}
  }
`;

export type LinkProps = {
  children?: ReactNode;
  to?: string;
  activeClassName?: string;
  className?: string;
  partiallyActive?: boolean;
  showLinkArrow?: boolean;
  hideExternalIcon?: boolean;
  showExternalIcon?: boolean;
  openInNewTab?: boolean;
  contentSite?: string | null | undefined;
  onClick?: () => void;
};

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
  showExternalIcon,
  openInNewTab,
  contentSite,
  onClick,
  ...other
}: LinkProps) => {
  const { pathPrefix, project } = useSiteMetadata();
  if (!to) to = '';
  const anchor = to.startsWith('#');

  const anchorProps = validateHTMAttributes('anchor', other);
  const { theme: siteTheme } = useDarkMode();

  //used instead of LG showLinkArrow prop for consistency between LGLinks and GatsbyLinks(GatsbyLinks don't have that prop)
  const decoration = showLinkArrow ? (
    <span>
      {' '}
      <ArrowRightIcon role="presentation" size={12} />{' '}
    </span>
  ) : (
    ''
  );

  // If contentSite, that means we are coming from the UnifiedSideNav and not the old SideNav
  if (contentSite) {
    // For an external links, inside the unified toc
    if (!isRelativeUrl(to)) {
      const strippedUrl = to?.replace(/(^https:\/\/)|(www\.)/g, '');
      const isMDBLink = strippedUrl.includes('mongodb.com/docs'); // For symlinks

      if (isMDBLink) {
        return (
          <LGLink
            className={joinClassNames(symLinkStyling, className)}
            href={to}
            hideExternalIcon={true}
            target={'_self'}
            {...anchorProps}
          >
            {children}
            {decoration}
            <Icon glyph={'ArrowRight'} fill={palette.gray.base} />
          </LGLink>
        );
      }

      return (
        <LGLink
          className={joinClassNames(lgLinkStyling, externalNavLinks, className)}
          href={to}
          hideExternalIcon={isMDBLink ? true : false}
          target={isMDBLink ? '_self' : '_blank'}
          style={{ fill: palette.gray.base }}
          {...anchorProps}
        >
          {children}
          {decoration}
        </LGLink>
      );
    }

    if (!to.startsWith('/')) to = `/${to}`;

    // Ensure trailing slash
    to = to.replace(/\/?(\?|#|$)/, '/$1');

    if (project === contentSite) {
      // Get rid of the contenteSite in link for internal links
      // Get rid of the path contentSite in link for internal links
      const editedTo = assertLeadingAndTrailingSlash(to.replace(pathPrefix, ''));

      return (
        <GatsbyLink
          className={cx(className)}
          activeClassName={activeClassName}
          partiallyActive={partiallyActive}
          to={editedTo}
          onClick={onClick}
          {...anchorProps}
        >
          {children}
          {decoration}
        </GatsbyLink>
      );
    }

    return (
      <a className={cx(className)} href={to}>
        {children}
        {decoration}
      </a>
    );
  }

  // Use Gatsby Link for internal links, and <a> for others
  if (to && isRelativeUrl(to) && !anchor) {
    if (!to.startsWith('/')) to = `/${to}`;

    // Ensure trailing slash
    to = to.replace(/\/?(\?|#|$)/, '/$1');

    return (
      <GatsbyLink
        className={cx(gatsbyLinkStyling(THEME_STYLES[siteTheme]), className)}
        activeClassName={activeClassName}
        partiallyActive={partiallyActive}
        to={to}
        onClick={onClick}
        {...anchorProps}
      >
        {children}
        {decoration}
      </GatsbyLink>
    );
  }

  const strippedUrl = to?.replace(/(^https:\/\/)|(www\.)/g, '');
  const isMDBLink = strippedUrl.includes('mongodb.com');
  const showExtIcon = showExternalIcon ?? (!anchor && !isMDBLink && !hideExternalIconProp);
  const target = !showExtIcon ? '_self' : undefined;

  return (
    <LGLink
      className={joinClassNames(lgLinkStyling, className)}
      href={to}
      hideExternalIcon={!showExtIcon}
      target={openInNewTab ? '_blank' : target}
      onClick={onClick}
      {...anchorProps}
    >
      {children}
      {decoration}
    </LGLink>
  );
};

export default Link;
