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

const borderType = '1px solid';

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
    border: ${borderType} ${uiColors.blue.light2};
    color: ${uiColors.blue.dark2};
  }
  span.post {
    border: ${borderType} ${uiColors.green.light2};
    color: ${uiColors.green.dark2};
  }
  span.put {
    border: ${borderType} ${uiColors.yellow.light2};
    color: ${uiColors.yellow.dark2};
  }
  span.patch {
    border: ${borderType} ${uiColors.yellow.light2};
    color: ${uiColors.yellow.dark2};
  }
  span.delete {
    border: ${borderType} ${uiColors.red.light2};
    color: ${uiColors.red.dark2};
  }

  span.operation-type {
    font-family: Akzidenz;
  }
`;

// Overwrite css of Redoc's components that can be easily selected and that do not have
// built-in theme options.
const globalCSS = css`
  ${codeBlockCss}
  ${sidebarCss}
  ${spanHttpCss}

  // "deprecated" badge
  span[type="warning"] {
    border: ${borderType} ${uiColors.yellow.light2};
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
  const text = <>← Back to {formatText(docsTitle)}</>;

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
          tempLoadingDivEl.remove();
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
              warning: {
                main: uiColors.yellow.light3,
                contrastText: uiColors.yellow.dark2,
              },
              http: {
                get: uiColors.blue.light3,
                post: uiColors.green.light3,
                put: uiColors.yellow.light3,
                patch: uiColors.yellow.light3,
                delete: uiColors.red.light3,
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
              fontFamily: 'Akzidenz',
              headings: {
                fontFamily: 'Akzidenz',
              },
              code: {
                fontSize: theme.fontSize.small,
                fontFamily: 'Source Code Pro',
                color: uiColors.black,
                backgroundColor: uiColors.gray.light3,
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
