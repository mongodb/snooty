import React from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import { ToastProvider } from '@leafygreen-ui/toast';
import ActionBar from './components/ActionBar/ActionBar';
import ContentTransition from './components/ContentTransition';
import Header from './components/Header';
import { Sidenav } from './components/Sidenav';
import RootProvider from './components/RootProvider';
import { getTemplate } from './utils/get-template';
import { usePresentationMode } from './hooks/use-presentation-mode';
import { useRemoteMetadata } from './hooks/use-remote-metadata';
import { getAllLocaleCssStrings } from './utils/locale';
import { OfflineDownloadProvider } from './components/OfflineDownloadModal/DownloadContext';

import { MetadataProvider } from './utils/use-snooty-metadata';
import { theme } from './theme/docsTheme';

import { ThemeProvider } from '@emotion/react';

import './styles/mongodb-docs.css';
import './styles/icons.css';
import './styles/global-dark-mode.css';

// TODO: Delete this as a part of the css cleanup
// Currently used to preserve behavior and stop legacy css
// from overriding specified styles in imported footer
const footerOverrides = css`
  footer {
    a:hover {
      color: currentColor;
    }
  }
`;

const globalCSS = css`
  ${getAllLocaleCssStrings()}

  body {
    font-size: 16px;
    line-height: 24px;
  }

  .hidden {
    display: inherit !important;
    height: 0;
    margin: 0;
    padding: 0;
    visibility: hidden !important;
    width: 0;
  }

  .header-buffer {
    scroll-margin-top: ${theme.header.navbarScrollOffset};
  }

  ${'' /* Originally from docs-tools navbar.css */}
  img.hide-medium-and-up,
  img.show-medium-and-up {
    max-width: 100%;
  }
  .hide-medium-and-up {
    display: none !important;
  }
  .show-medium-and-up {
    display: block !important;
  }
  @media (max-width: 767px) {
    .hide-medium-and-up {
      display: block !important;
    }
    .show-medium-and-up {
      display: none !important;
    }
  }

  ${footerOverrides}

  /* To ensure the Chatbot ModalView has precedence over the consistent-nav */
  /* In next Chatbot release, a className can be specified as a prop giving us more granular specificity */
  /* At that time, remove or improve the following lines */
  div[id^=modal-] {
    z-index: ${theme.zIndexes.widgets} !important;
  }
`;

const GlobalGrid = styled('div')`
  display: grid;
  grid-template-areas:
    'header header'
    'sidenav contents';
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  overflow: clip;
`;

export const StyledContentContainer = styled('div')`
  grid-area: contents;
  margin: 0px;
`;

// have Toasts come up with z index above the side nav
const toastPortalStyling = LeafyCSS`
  z-index: ${theme.zIndexes.sidenav + 1};
`;

export const DefaultLayout = ({ children, data: { page }, pageContext: { slug, repoBranches, template } }) => {
  const { sidenav } = getTemplate(template);

  // const { chapters, guides, slugToTitle, toctree, eol, project } = useSnootyMetadata();
  const { chapters, guides, slugToTitle, toctree, eol, project } = {
    chapters: [],
    guides: [],
    slugToTitle: () => '',
    toctree: {},
    eol: false,
    project: 'foo',
  };

  const remoteMetadata = useRemoteMetadata();

  const isInPresentationMode = (() => {
    const p = usePresentationMode();
    const q = Array.isArray(p) ? p.join('') : p;
    return q?.toLocaleLowerCase() === 'true';
  })();
  const pageTitle = React.useMemo(
    () => page?.ast?.options?.title || slugToTitle?.[slug === '/' ? 'index' : slug],
    [slug] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ThemeProvider theme={theme}>
      <MetadataProvider metadata={{ project: 'foo', database: {}, toctree: {} }}>
        <Global styles={globalCSS} />
        <RootProvider
          slug={slug}
          repoBranches={repoBranches}
          headingNodes={page?.ast?.options?.headings}
          remoteMetadata={remoteMetadata}
        >
          <GlobalGrid>
            {!isInPresentationMode ? <Header eol={eol} template={template} /> : <div />}
            {sidenav && !isInPresentationMode ? (
              <ToastProvider portalClassName={cx(toastPortalStyling)}>
                <OfflineDownloadProvider>
                  <Sidenav
                    chapters={chapters}
                    guides={guides}
                    page={page.ast}
                    pageTitle={pageTitle}
                    repoBranches={repoBranches}
                    slug={slug}
                    eol={eol}
                  />
                </OfflineDownloadProvider>
              </ToastProvider>
            ) : (
              <div />
            )}
            <StyledContentContainer>
              <ActionBar template={template} slug={slug} sidenav={sidenav} />
              <ContentTransition slug={slug}>{children}</ContentTransition>
            </StyledContentContainer>
          </GlobalGrid>
        </RootProvider>
      </MetadataProvider>
    </ThemeProvider>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  pageContext: PropTypes.shape({
    chapters: PropTypes.object,
    guides: PropTypes.object,
    slug: PropTypes.string,
    template: PropTypes.string,
  }).isRequired,
  data: PropTypes.shape({
    page: PropTypes.shape({
      children: PropTypes.array,
      options: PropTypes.object,
    }).isRequired,
  }).isRequired,
};
