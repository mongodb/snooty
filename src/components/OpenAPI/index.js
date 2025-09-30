import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import { RedocStandalone } from 'redoc';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';
import DocsHomeButton from '../Sidenav/DocsHomeButton';
import { Border } from '../Sidenav/Sidenav';
import Spinner from '../Spinner';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import useStickyTopValues from '../../hooks/useStickyTopValues';
import { isBrowser } from '../../utils/is-browser';
import { theme } from '../../theme/docsTheme';
import { getPlaintext } from '../../utils/get-plaintext';
import { fetchOASFile } from '../../utils/openapi-spec';
import { isLinkInWhitelist, WhitelistErrorCallout } from './whitelist';
import {
  codeBlockCss,
  deprecatedBadgeCss,
  headingsCss,
  inlineCodeCss,
  leftSidebarCss,
  rightSidebarCss,
  schemaDataTypesCss,
  spanHttpCss,
  themeOption,
} from './styles';

// Important notes:
// The contents of this file are (unfortunately) a hacky and brittle way of getting Redoc's React component to
// look like our docs while maintaining the same workflow and processes for delivering docs.
// CSS selectors were declared as specific as possible while also being flexible enough for reusable components.
// Upgrading our version of Redoc may result in broken css rules, so please double-check afterwards.

const menuContentClass = 'menu-content';
const menuTitleContainerClass = 'menu-title-container';

const getTopAndHeight = (topValue) => css`
  top: ${topValue} !important;
  height: calc(100vh - ${topValue}) !important;
`;

// Overwrite css of Redoc's components that can be easily selected and that do not have
// built-in theme options.
const getGlobalCss = ({ topLarge, topMedium }) => css`
  ${headingsCss}
  ${codeBlockCss}
  ${inlineCodeCss}
  ${leftSidebarCss}
  ${rightSidebarCss}
  ${schemaDataTypesCss}
  ${spanHttpCss}
  ${deprecatedBadgeCss}

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
        color: ${palette.gray.dark1};
        font-size: ${theme.fontSize.small};

        :hover,
        :focus {
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
  font-size: ${theme.fontSize.small};
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

const MenuTitleContainer = ({ pageTitle }) => {
  return (
    <>
      <DocsHomeButton hideDarkModeToggle={true} />
      <Border />
      <MenuTitle>{pageTitle}</MenuTitle>
    </>
  );
};

const OpenAPI = ({ metadata, nodeData: { argument, children, options = {} }, page, ...rest }) => {
  const usesRST = options?.['uses-rst'];
  const usesNextAPI = options?.['uses-realm'];
  const { database } = useSiteMetadata();
  const [nextAPISpec, setNextAPISpec] = useState(null);
  const topValues = useStickyTopValues();
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidSpecUrl, setHasValidSpecUrl] = useState(true);
  const [src, setSrc] = useState(null);
  let specUrl, spec;

  // Attempt to fetch a spec from Next API route
  useEffect(() => {
    if (usesNextAPI) {
      const apiName = getPlaintext(argument);
      fetchOASFile(apiName, database)
        .then((response) => setNextAPISpec(response))
        .catch((e) => console.error(e));
    }
  }, [argument, database, usesNextAPI]);

  useEffect(() => {
    if (isBrowser) {
      const urlParams = new URLSearchParams(window.location.search);
      setSrc(urlParams?.get('src'));
      setHasValidSpecUrl(!!src && isLinkInWhitelist(src));
    }
  }, [src]);

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

  spec = usesNextAPI ? nextAPISpec : JSON.parse(children[0]?.value || '{}');
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
                createRoot(menuTitleContainerEl).render(<MenuTitleContainer pageTitle={pageTitle} />);
              }
            }
          }}
          options={{
            hideLoading: true,
            maxDisplayedEnumValues: 5,
            theme: themeOption,
            untrustedSpec: !!specUrl,
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
