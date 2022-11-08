import React, { useState, useEffect, useContext } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import { AppStore, Redoc, RedocStandalone } from 'redoc';
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
import { OpenAPIContext } from './openapi-context';

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

const injectCustomComponents = (pageTitle, siteTitle) => {
  // Don't inject anything if menu title container already exists.
  const menuTest = document.querySelector(`.${menuTitleContainerClass}`);
  if (menuTest) return;

  const sidebarEl = document.querySelector(`.${menuContentClass}`);
  if (!sidebarEl) return;
  const searchEl = document.querySelector('div[role="search"]');
  if (!searchEl) return;

  // Insert back button and page title to redoc's sidenav
  const menuTitleContainerEl = document.createElement('div');
  menuTitleContainerEl.className = menuTitleContainerClass;
  sidebarEl.insertBefore(menuTitleContainerEl, searchEl);
  render(<MenuTitleContainer siteTitle={siteTitle} pageTitle={pageTitle} />, menuTitleContainerEl);
};

const REDOC_OPTIONS = {
  hideLoading: true,
  maxDisplayedEnumValues: 5,
  theme: themeOption,
};

const OpenAPIPreview = ({ metadata, nodeData: { argument, children, options = {} }, page, ...rest }) => {
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
            const pageTitle = page?.options?.title || '';
            const siteTitle = metadata?.title;
            injectCustomComponents(pageTitle, siteTitle);
          }}
          options={{
            ...REDOC_OPTIONS,
            untrustedSpec: !!specUrl,
          }}
          spec={spec}
          specUrl={src}
        />
      )}
    </>
  );
};

const OpenAPIStatic = ({ metadata: { title: siteTitle }, topValues }) => {
  const { store } = useContext(OpenAPIContext);
  store['options'] = REDOC_OPTIONS;

  useEffect(() => {
    if (!store) return;
    const pageTitle = store.spec.data.info.title;
    injectCustomComponents(pageTitle, siteTitle);
  }, [siteTitle, store]);

  if (!store) {
    console.error('Missing spec store.');
    return null;
  }

  const deserializedStore = AppStore.fromJS(store);
  return (
    <>
      <Global styles={getGlobalCss(topValues)} />
      <Redoc store={deserializedStore} />
    </>
  );
};

const OpenAPI = ({ metadata, nodeData, ...rest }) => {
  const { options } = nodeData;
  const isPreview = options['preview'];
  const topValues = useStickyTopValues();

  return isPreview ? (
    <OpenAPIPreview metadata={metadata} nodeData={nodeData} topValues={topValues} {...rest} />
  ) : (
    <OpenAPIStatic metadata={metadata} topValues={topValues} />
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
