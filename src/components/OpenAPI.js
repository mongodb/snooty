import React, { useState } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import { RedocStandalone } from 'redoc';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from './ComponentFactory';
import SidebarBackButton from './SidebarBackButton';
import Spinner from './Spinner';
import { theme } from '../theme/docsTheme';
import { formatText } from '../utils/format-text';

const badgeBorderRadius = '50px';
const badgeBorderType = '1px solid';
const codeFontFamily = 'Source Code Pro';
const inlineCodeBackgroundColor = uiColors.gray.light3;
const inlineCodeBorderColor = uiColors.gray.light1;
const schemaDataTypeColor = uiColors.blue.dark3;
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

const leftSidebarCss = css`
  // Keep sticky below top navbar
  // TODO: Check if this is needed after merging docs-nav
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

const rightSidebarCss = css`
  ul.react-tabs__tab-list {
    li[role='tab'] {
      background-color: ${uiColors.gray.dark2};
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
    border: ${badgeBorderType} ${uiColors.blue.light2};
    color: ${uiColors.blue.dark2};
  }
  span.post {
    border: ${badgeBorderType} ${uiColors.green.light2};
    color: ${uiColors.green.dark2};
  }
  span.patch,
  span.put {
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
    font-weight: bold;
  }
`;

// Overwrite css of Redoc's components that can be easily selected and that do not have
// built-in theme options.
const globalCSS = css`
  ${codeBlockCss}
  ${inlineCodeCss}
  ${leftSidebarCss}
  ${rightSidebarCss}
  ${schemaDataTypesCss}
  ${spanHttpCss}

  // Prevent content from appearing on top of navbar/banner when scrolling
  // TODO: Look into removing after docs-nav
  div.redoc-wrap {
    z-index: 0;
  }

  // "deprecated" badge
  span[type='warning'] {
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

  // Prevent long enum names from overlapping with right sidebar code blocks
  table {
    word-break: break-word;
  }
`;

const Border = styled('hr')`
  border: unset;
  border-bottom: 1px solid ${uiColors.gray.light2};
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

// Copied over from docs-nav; TODO: consolidate title style after docs-nav merge to master
const MenuTitle = styled('div')`
  color: ${uiColors.gray.dark3};
  font-size: ${theme.fontSize.default};
  font-weight: bold;
  line-height: 20px;
  margin: ${theme.size.medium} ${theme.size.default};
  text-transform: capitalize;
`;

const LoadingWidget = ({ className }) => (
  <LoadingContainer className={className}>
    <LoadingMessage>Loading</LoadingMessage>
    <Spinner size={48} />
  </LoadingContainer>
);

const MenuTitleContainer = ({ siteTitle, pageTitle }) => {
  const docsTitle = siteTitle ? `${siteTitle} Docs` : 'Docs';
  const text = <>&#8592; Back to {formatText(docsTitle)}</>;

  return (
    <>
      <SidebarBackButton border={<Border />} enableGlyph={false} textOverride={text} title={docsTitle} url={'/'} />
      <MenuTitle>{pageTitle}</MenuTitle>
    </>
  );
};

const OpenAPI = ({ metadata, nodeData: { argument, children, options = {} }, page, ...rest }) => {
  const usesRST = options?.['uses-rst'];
  // Keep track of if the Redoc component has already loaded once
  const [load, setLoad] = useState(false);

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
  const tempLoadingDivClassName = 'openapi-loading-container';
  const siteTitle = metadata?.title;

  return (
    <>
      <Global styles={globalCSS} />
      {/* Temporary loading widget to be removed once the Redoc component loads */}
      <LoadingWidget className={tempLoadingDivClassName} />
      <RedocStandalone
        onLoaded={() => {
          if (load) {
            return;
          }
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
          // Prevent showing the loading widget and side nav additions more than once
          setLoad(true);
        }}
        options={{
          hideLoading: true,
          maxDisplayedEnumValues: 5,
          scrollYOffset: theme.size.stripUnit(theme.navbar.baseHeight),
          theme: {
            codeBlock: {
              backgroundColor: uiColors.black,
            },
            colors: {
              error: {
                main: uiColors.red.dark1,
              },
              // Only applies to background color; color and border color touched by css
              http: {
                get: uiColors.blue.light3,
                post: uiColors.green.light3,
                put: uiColors.yellow.light3,
                patch: uiColors.yellow.light3,
                delete: uiColors.red.light3,
              },
              primary: {
                main: uiColors.gray.dark3,
              },
              responses: {
                success: {
                  color: uiColors.green.dark1,
                  backgroundColor: uiColors.green.light3,
                  tabTextColor: uiColors.green.base,
                },
                error: {
                  color: uiColors.red.dark1,
                  backgroundColor: uiColors.red.light3,
                  tabTextColor: uiColors.red.base,
                },
              },
              text: {
                primary: uiColors.gray.dark3,
              },
              warning: {
                main: uiColors.yellow.light3,
                contrastText: uiColors.yellow.dark2,
              },
            },
            rightPanel: {
              backgroundColor: uiColors.gray.dark3,
            },
            schema: {
              requireLabelColor: uiColors.red.base,
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
                backgroundColor: inlineCodeBackgroundColor,
                color: uiColors.black,
                fontFamily: codeFontFamily,
                fontSize: theme.fontSize.small,
              },
              links: {
                color: uiColors.blue.base,
                hover: uiColors.blue.dark2,
                visited: uiColors.blue.base,
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
