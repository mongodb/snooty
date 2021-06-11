import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import { RedocStandalone } from 'redoc';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from './ComponentFactory';
import SidebarBack from './SidebarBack';
import { theme } from '../theme/docsTheme';
import { formatText } from '../utils/format-text';

const NAVBAR_HEIGHT = 45;

const badgeBorderRadius = '50px';
const badgeBorderType = '1px solid';
const codeFontFamily = 'Source Code Pro';
const inlineCodeBackgroundColor = uiColors.gray.light3;
const inlineCodeBorderColor = uiColors.gray.light1;
const textFontFamily = 'Akzidenz';

const codeBlockCss = css`
  span.ellipsis:after {
    color: ${uiColors.white};
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
    color: ${uiColors.white};
  }
  span.token.string:not(.property) {
    color: #98c379 !important;
  }

  // Code block divs
  div.hoverable {
    color: ${uiColors.white};
  }
`;

const inlineCodeCss = css`
  // InlineCode inside of Parameters and Schemas
  span.sc-eLgOdN {
    background-color: ${inlineCodeBackgroundColor};
    border-color: ${inlineCodeBorderColor};
  }
  // InlineCode found in data types of Parameters and Schemas; example: "string 24 characters"
  span.sc-kIeTtH {
    background-color: ${inlineCodeBackgroundColor};
    border-color: ${inlineCodeBorderColor};
  }
`;

const sidebarCss = css`
  // Keep sticky below top navbar
  .menu-content {
    top: ${theme.navbar.height} !important;
  }

  label[role='menuitem'] {
    :hover {
      background-color: ${uiColors.gray.light2};
    }
    &.active {
      background-color: ${uiColors.green.light3};
    }
  }
`;

const spanHttpCss = css`
  span.get {
    border: ${badgeBorderType} ${uiColors.blue.light2};
    color: ${uiColors.blue.dark2};
  }
  span.post {
    border: ${badgeBorderType} ${uiColors.green.light2};
    color: ${uiColors.green.dark2};
  }
  span.put {
    border: ${badgeBorderType} ${uiColors.yellow.light2};
    color: ${uiColors.yellow.dark2};
  }
  span.patch {
    border: ${badgeBorderType} ${uiColors.yellow.light2};
    color: ${uiColors.yellow.dark2};
  }
  span.delete {
    border: ${badgeBorderType} ${uiColors.red.light2};
    color: ${uiColors.red.dark2};
  }

  // Left sidebar badges
  span.operation-type {
    border-radius: ${badgeBorderRadius};
    font-family: ${textFontFamily};
  }

  // Right sidebar badges
  span.http-verb {
    border-radius: ${badgeBorderRadius};
  }
`;

// Overwrite css of Redoc's components that can be easily selected and that do not have
// built-in theme options.
const globalCSS = css`
  ${codeBlockCss}
  ${inlineCodeCss}
  ${sidebarCss}
  ${spanHttpCss}

  // "deprecated" badge
  span[type="warning"] {
    border: ${badgeBorderType} ${uiColors.yellow.light2};
    border-radius: ${badgeBorderRadius};
  }

  .menu-title-container {
    padding-top: 24px;

    li {
      list-style: none inside none;

      a {
        font-size: ${theme.fontSize.default};

        :hover,
        :focus {
          color: ${uiColors.gray.dark3};
          text-decoration: none;
        }

        ::before {
          background-color: transparent;
        }
      }
    }
  }

  // Request Body Schema "One of" pills
  button.sc-fKFyDc {
    border-radius: ${badgeBorderRadius};
  }

  // Responses buttons
  button.sc-eFubAy {
    border-radius: 6px;
  }
`;

// Copied over from docs-nav; consolidate title style after docs-nav merge to master
const titleStyle = css`
  color: ${uiColors.gray.dark3};
  font-size: ${theme.fontSize.default};
  font-weight: bold;
  line-height: 20px;
  text-transform: capitalize;
`;

const Border = styled('hr')`
  border: unset;
  border-bottom: 1px solid ${uiColors.gray.light2};
  margin: ${theme.size.default} 0;
  width: 100%;
`;

const MenuTitle = styled('div')`
  ${titleStyle}

  margin: ${theme.size.medium} ${theme.size.default};
`;

const MenuTitleContainer = ({ siteTitle, pageTitle }) => {
  const docsTitle = siteTitle + ' Docs';
  const text = <>&#8592; Back to {formatText(docsTitle)}</>;

  return (
    <>
      <SidebarBack border={<Border />} enableGlyph={false} textOverride={text} title={docsTitle} url={'/'} />
      <MenuTitle>{pageTitle}</MenuTitle>
    </>
  );
};

const OpenAPI = ({ metadata, nodeData: { argument, children, options = {} }, page, ...rest }) => {
  const usesRST = options?.['uses-rst'];

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

  // Check for JSON string spec first
  const spec = children[0]?.value;
  const specOrUrl = spec ? JSON.parse(spec) : argument[0]?.refuri;
  if (!specOrUrl) {
    return null;
  }
  const pageTitle = page?.options?.title || '';
  const siteTitle = metadata?.title;
  const tempLoadingDivClassName = 'openapi-loading-margin';

  return (
    <>
      <Global styles={globalCSS} />
      {/* Temporary div to be removed once the Redoc component loads. Provides additional space for Redoc's
       loader to load below the navbar. TODO: Check if this is necessary on new docs-nav */}
      <div
        className={tempLoadingDivClassName}
        css={css`
          margin-top: 90px;
        `}
      />
      <RedocStandalone
        onLoaded={() => {
          // Remove temporary loading margin from DOM
          const tempLoadingDivEl = document.querySelector(`.${tempLoadingDivClassName}`);
          if (tempLoadingDivEl) {
            tempLoadingDivEl.remove();
          }
          // Insert back button and page title to redoc's sidenav
          const sidebarEl = document.querySelector('.menu-content');
          if (sidebarEl) {
            const searchEl = document.querySelector('div[role="search"]');
            if (searchEl) {
              const menuTitleContainerEl = document.createElement('div');
              menuTitleContainerEl.className = 'menu-title-container';
              sidebarEl.insertBefore(menuTitleContainerEl, searchEl);
              render(<MenuTitleContainer siteTitle={siteTitle} pageTitle={pageTitle} />, menuTitleContainerEl);
            }
          }
        }}
        options={{
          maxDisplayedEnumValues: 5,
          scrollYOffset: NAVBAR_HEIGHT,
          theme: {
            codeBlock: {
              backgroundColor: uiColors.gray.dark3,
            },
            colors: {
              http: {
                get: uiColors.blue.light3,
                post: uiColors.green.light3,
                put: uiColors.yellow.light3,
                patch: uiColors.yellow.light3,
                delete: uiColors.red.light3,
              },
              primary: {
                main: uiColors.black,
              },
              responses: {
                success: {
                  color: uiColors.green.dark1,
                  backgroundColor: uiColors.green.light3,
                  tabTextColor: uiColors.green.dark1,
                },
                error: {
                  color: uiColors.red.dark1,
                  backgroundColor: uiColors.red.light3,
                  tabTextColor: uiColors.red.dark1,
                },
              },
              text: {
                primary: uiColors.black,
              },
              warning: {
                main: uiColors.yellow.light3,
                contrastText: uiColors.yellow.dark2,
              },
            },
            rightPanel: {
              backgroundColor: uiColors.gray.dark3,
            },
            sidebar: {
              activeTextColor: `${uiColors.green.dark3} !important`,
              backgroundColor: uiColors.gray.light3,
              textColor: uiColors.gray.dark3,
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
                fontSize: theme.fontSize.small,
                fontFamily: codeFontFamily,
                color: uiColors.black,
                backgroundColor: inlineCodeBackgroundColor,
              },
              links: {
                color: uiColors.blue.base,
                hover: uiColors.blue.dark2,
                visited: uiColors.blue.dark2,
              },
            },
          },
        }}
        spec={specOrUrl}
        specUrl={specOrUrl}
      />
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
