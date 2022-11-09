import React, { useEffect, useState } from 'react';
import { RedocStandalone } from 'redoc';
import styled from '@emotion/styled';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { getPlaintext } from '../../utils/get-plaintext';
import { isBrowser } from '../../utils/is-browser';
import { fetchOASFile } from '../../utils/realm';
import ComponentFactory from '../ComponentFactory';
import { isLinkInWhitelist, WhitelistErrorCallout } from './whitelist';
import { theme } from '../../theme/docsTheme';
import { REDOC_OPTIONS } from './constants';
import Spinner from '../Spinner';
import { injectCustomComponents } from './custom-components';

const JustifiedWhitelistWarning = styled(WhitelistErrorCallout)`
  margin: 20px auto;
  max-width: 840px;
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

const LoadingWidget = ({ className }) => (
  <LoadingContainer className={className}>
    <LoadingMessage>Loading</LoadingMessage>
    <Spinner size={48} />
  </LoadingContainer>
);

// Sources and parses the specs on client-side
const OpenAPIClientSide = ({ metadata, nodeData: { argument, children, options = {} }, page, topValues, ...rest }) => {
  const usesRST = options?.['uses-rst'];
  const usesRealm = options?.['uses-realm'];
  const { database } = useSiteMetadata();
  const [realmSpec, setRealmSpec] = useState(null);
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

export default OpenAPIClientSide;
