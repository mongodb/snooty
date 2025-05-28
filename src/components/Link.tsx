import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import { css, cx } from '@leafygreen-ui/emotion';
import { Link as LGLink } from '@leafygreen-ui/typography';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
// @ts-ignore
import ArrowRightIcon from '@leafygreen-ui/icon/dist/ArrowRight';
import { isRelativeUrl } from '../utils/is-relative-url';
import { joinClassNames } from '../utils/join-class-names';
import { validateHTMAttributes } from '../utils/validate-element-attributes';

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

  > code {
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
`;

export type LinkProps = {
  children: ReactNode;
  to: string;
  activeClassName?: string;
  className?: string;
  partiallyActive?: boolean;
  showLinkArrow?: boolean;
  hideExternalIcon?: boolean;
  showExternalIcon?: boolean;
  openInNewTab?: boolean;
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
  ...other
}: LinkProps) => {
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
