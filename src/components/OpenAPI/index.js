import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import { RedocStandalone } from 'redoc';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';
import { SidenavBackButton } from '../Sidenav';
import Spinner from '../Spinner';
import { isLinkInWhitelist, WhitelistErrorCallout } from './whitelist';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import useStickyTopValues from '../../hooks/useStickyTopValues';
import { isBrowser } from '../../utils/is-browser';
import { theme } from '../../theme/docsTheme';
import { getPlaintext } from '../../utils/get-plaintext';
import { fetchOASFile } from '../../utils/realm';
// Important notes:
// The contents of this file are (unfortunately) a hacky and brittle way of getting Redoc's React component to
// look like our docs while maintaining the same workflow and processes for delivering docs.
// CSS selectors were declared as specific as possible while also being flexible enough for reusable components.
// Upgrading our version of Redoc may result in broken css rules, so please double-check afterwards.

const badgeBorderRadius = '50px';
const badgeBorderType = '1px solid';
const codeFontFamily = 'Source Code Pro';
const inlineCodeBackgroundColor = palette.gray.light3;
const inlineCodeBorderColor = palette.gray.light1;
const menuContentClass = 'menu-content';
const menuTitleContainerClass = 'menu-title-container';
const schemaDataTypeColor = palette.blue.dark3;
const textFontFamily = 'Akzidenz';

const codeBlockCss = css`
  // General code tags, especially for code blocks
  code {
    font-family: ${codeFontFamily};
  }

  // Code block divs
  div.hoverable {
    color: ${palette.white};
  }

  // Highlight syntax in code blocks
  span.ellipsis:after {
    color: ${palette.white};
  }
  span.token.boolean {
    color: #e06c75 !important;
  }
  span.token.keyword {
    color: #c678dd !important;
  }
  span.token.number {
    color: #61aeee !important;
  }
  span.token.punctuation {
    color: ${palette.white};
  }
  span.token.string:not(.property) {
    color: #98c379 !important;
  }
`;

const inlineCodeCss = css`
  // InlineCode inside of Parameters and Schemas
  span.sc-eLgOdN,
  // InlineCode found in data types of Parameters and Schemas; example: "string 24 characters"
  span.sc-kIeTtH {
    background-color: ${inlineCodeBackgroundColor};
    border-color: ${inlineCodeBorderColor};
  }
`;

const leftSidebarCss = css`
  label[role='menuitem'] {
    :hover {
      background-color: ${palette.gray.light2};
    }
    &.active {
      background-color: ${palette.green.light3};
    }
  }
`;

const rightSidebarCss = css`
  ul.react-tabs__tab-list {
    li[role='tab'] {
      background-color: ${palette.gray.dark2};
      border: unset;
    }
  }
`;

const schemaDataTypesCss = css`
  // Request Body Schema "One of" pills
  button.sc-fKFyDc {
    border-radius: ${badgeBorderRadius};
  }

  // Responses buttons
  button.sc-eFubAy {
    border-radius: 6px;
  }

  // Data types under query parameters; ex - "string" / "boolean"
  span.sc-fWSCIC,
  // Regex next to data types under query parameters; ex - "^([\w]{24})$"
  span.sc-hlTvYk,
  // "Array of" keyword next to data types under query parameters
  span.sc-GqfZa,
  // Parenthesized data types under query paramters; ex - "(ObjectId)"
  span.sc-dwfUOf {
    color: ${schemaDataTypeColor};
  }
`;

const spanHttpCss = css`
  span.get {
    border: ${badgeBorderType} ${palette.blue.light2};
    color: ${palette.blue.dark2};
  }
  span.post {
    border: ${badgeBorderType} ${palette.green.light2};
    color: ${palette.green.dark2};
  }
  span.patch,
  span.put {
    border: ${badgeBorderType} ${palette.yellow.light2};
    color: ${palette.yellow.dark2};
  }
  span.delete {
    border: ${badgeBorderType} ${palette.red.light2};
    color: ${palette.red.dark2};
  }

  // Left sidebar badges
  span.operation-type {
    border-radius: ${badgeBorderRadius};
    font-family: ${textFontFamily};
  }

  // Right sidebar badges
  span.http-verb {
    border-radius: ${badgeBorderRadius};
    font-weight: bold;
  }
`;

const getTopAndHeight = (topValue) => css`
  top: ${topValue} !important;
  height: calc(100vh - ${topValue}) !important;
`;

// Overwrite css of Redoc's components that can be easily selected and that do not have
// built-in theme options.
const getGlobalCss = ({ topLarge, topMedium }) => css`
  ${codeBlockCss}
  ${inlineCodeCss}
  ${leftSidebarCss}
  ${rightSidebarCss}
  ${schemaDataTypesCss}
  ${spanHttpCss}

  // "deprecated" badge
  span[type='warning'] {
    border: ${badgeBorderType} ${palette.yellow.light2};
    border-radius: ${badgeBorderRadius};
  }

  // Overwrite the menu/sidebar's top and height using css because Redoc's scrollYOffset
  // option doesn't take into account React state changes associated with screen size and viewport hooks.
  .${menuContentClass} {
    ${getTopAndHeight(topLarge)}

    @media ${theme.screenSize.upToLarge} {
      ${getTopAndHeight(topMedium)}
    }
  }

  .${menuTitleContainerClass} {
    padding-top: ${theme.size.default};

    li {
      list-style: none inside none;

      a {
        font-size: ${theme.fontSize.default};

        :hover,
        :focus {
          color: ${palette.gray.dark3};
          text-decoration: none;
        }

        ::before {
          background-color: transparent;
        }
      }
    }
  }

  // Prevent long enum names from overlapping with right sidebar code blocks
  table {
    word-break: break-word;
  }
`;

const Border = styled('hr')`
  border: unset;
  border-bottom: 1px solid ${palette.gray.light2};
  margin: ${theme.size.default} 0;
  width: 100%;
`;

const LoadingContainer = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 180px 0 ${theme.size.medium} 0;
`;

const LoadingMessage = styled('div')`
  font-size: ${theme.fontSize.h1};
  margin-bottom: ${theme.size.small};
`;

const MenuTitle = styled('div')`
  color: ${palette.gray.dark3};
  font-size: ${theme.fontSize.default};
  font-weight: bold;
  line-height: 20px;
  margin: ${theme.size.medium} ${theme.size.default};
  text-transform: capitalize;
`;

const JustifiedWhitelistWarning = styled(WhitelistErrorCallout)`
  margin: 20px auto;
  max-width: 840px;
`;

const LoadingWidget = ({ className }) => (
  <LoadingContainer className={className}>
    <LoadingMessage>Loading</LoadingMessage>
    <Spinner size={48} />
  </LoadingContainer>
);

const MenuTitleContainer = ({ siteTitle, pageTitle }) => {
  const docsTitle = siteTitle ? `${siteTitle} Docs` : 'Docs';
  return (
    <>
      {/* Disable LG left arrow glyph due to bug where additional copies of the LG icon would be rendered 
          at the bottom of the page. */}
      <SidenavBackButton border={<Border />} enableGlyph={false} target="/" titleOverride={docsTitle} />
      <MenuTitle>{pageTitle}</MenuTitle>
    </>
  );
};

const OpenAPI = ({ metadata, nodeData: { argument, children, options = {} }, page, ...rest }) => {
  const usesRST = options?.['uses-rst'];
  const usesRealm = options?.['uses-realm'];
  const { database } = useSiteMetadata();
  const [realmSpec, setRealmSpec] = useState(null);
  const topValues = useStickyTopValues();
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidSpecUrl, setHasValidSpecUrl] = useState(true);
  const [src, setSrc] = useState(null);
  const urlParams = isBrowser ? new URLSearchParams(window.location.search) : null;
  let specUrl, spec;

  // Attempt to fetch a spec from Realm
  useEffect(() => {
    if (usesRealm) {
      const apiName = getPlaintext(argument);
      fetchOASFile(apiName, database)
        .then((response) => setRealmSpec(response))
        .catch((e) => console.error(e));
    }
  }, [argument, database, usesRealm]);

  useEffect(() => {
    setSrc(urlParams?.get('src'));
    setHasValidSpecUrl(!!src && isLinkInWhitelist(src));
  }, [src, urlParams]);

  // Use snooty openapi components, such as for docs-realm
  if (usesRST) {
    return (
      <>
        {children.map((node, i) => (
          <ComponentFactory key={i} metadata={metadata} nodeData={node} page={page} {...rest} />
        ))}
      </>
    );
  }

  spec = usesRealm ? realmSpec : JSON.parse(children[0]?.value || '{}');
  spec = !src ? spec : null;

  // Create our loading widget
  const tempLoadingDivClassName = 'openapi-loading-container';
  const needsWhitelistWarning = src && !hasValidSpecUrl;
  return (
    <>
      <Global styles={getGlobalCss(topValues)} />
      {needsWhitelistWarning && <JustifiedWhitelistWarning />}
      {/* Temporary loading widget to be removed once the Redoc component loads */}
      {isLoading && !needsWhitelistWarning && <LoadingWidget className={tempLoadingDivClassName} />}
      {((src && hasValidSpecUrl) || spec) && (
        <RedocStandalone
          onLoaded={() => {
            setIsLoading(false);
            const menuTest = document.querySelector(`.${menuTitleContainerClass}`);
            if (menuTest) {
              return;
            }
            // Insert back button and page title to redoc's sidenav
            const sidebarEl = document.querySelector(`.${menuContentClass}`);
            if (sidebarEl) {
              const searchEl = document.querySelector('div[role="search"]');
              if (searchEl) {
                const menuTitleContainerEl = document.createElement('div');
                menuTitleContainerEl.className = menuTitleContainerClass;
                sidebarEl.insertBefore(menuTitleContainerEl, searchEl);
                const pageTitle = page?.options?.title || '';
                const siteTitle = metadata?.title;
                render(<MenuTitleContainer siteTitle={siteTitle} pageTitle={pageTitle} />, menuTitleContainerEl);
              }
            }
          }}
          options={{
            hideLoading: true,
            maxDisplayedEnumValues: 5,
            theme: {
              breakpoints: {
                small: '768px',
                medium: '1024px',
                large: '1200px',
              },
              codeBlock: {
                backgroundColor: palette.black,
              },
              colors: {
                error: {
                  main: palette.red.dark1,
                },
                // Only applies to background color; color and border color touched by css
                http: {
                  get: palette.blue.light3,
                  post: palette.green.light3,
                  put: palette.yellow.light3,
                  patch: palette.yellow.light3,
                  delete: palette.red.light3,
                },
                primary: {
                  main: palette.gray.dark3,
                },
                responses: {
                  success: {
                    color: palette.green.dark1,
                    backgroundColor: palette.green.light3,
                    tabTextColor: palette.green.base,
                  },
                  error: {
                    color: palette.red.dark1,
                    backgroundColor: palette.red.light3,
                    tabTextColor: palette.red.base,
                  },
                },
                text: {
                  primary: palette.gray.dark3,
                },
                warning: {
                  main: palette.yellow.light3,
                  contrastText: palette.yellow.dark2,
                },
              },
              rightPanel: {
                backgroundColor: palette.gray.dark3,
              },
              schema: {
                requireLabelColor: palette.red.base,
              },
              sidebar: {
                activeTextColor: `${palette.green.dark3} !important`,
                backgroundColor: palette.gray.light3,
                textColor: palette.gray.dark3,
                width: '268px',
              },
              spacing: {
                unit: 4,
                sectionVertical: 16,
              },
              typography: {
                fontSize: theme.fontSize.default,
                fontFamily: textFontFamily,
                headings: {
                  fontFamily: textFontFamily,
                },
                code: {
                  backgroundColor: inlineCodeBackgroundColor,
                  color: palette.black,
                  fontFamily: codeFontFamily,
                  fontSize: theme.fontSize.small,
                },
                links: {
                  color: palette.blue.base,
                  hover: palette.blue.dark2,
                  visited: palette.blue.base,
                },
              },
            },
            untrustedDefinition: !!specUrl,
          }}
          spec={spec}
          specUrl={src}
        />
      )}
    </>
  );
};

OpenAPI.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      uses_rst: PropTypes.bool,
    }),
  }).isRequired,
};

export default OpenAPI;
