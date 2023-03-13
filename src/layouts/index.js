import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import ContentTransition from '../components/ContentTransition';
import Header from '../components/Header';
import { Sidenav } from '../components/Sidenav';
import SiteMetadata from '../components/site-metadata';
import RootProvider from '../components/RootProvider';
import { getTemplate } from '../utils/get-template';
import { useDelightedSurvey } from '../hooks/useDelightedSurvey';
import { theme } from '../theme/docsTheme';
import useSnootyMetadata from '../utils/use-snooty-metadata';

const QUERY_PARAM_FOR_DISABLING_ELEMENTS = 'presentation';

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
`;

const GlobalGrid = styled('div')`
  display: grid;
  grid-template-areas:
    'header header'
    'sidenav contents';
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
`;

const DefaultLayout = ({
  location,
  children,
  pageContext: { page, slug, repoBranches, template, associatedReposInfo, isAssociatedProduct, remoteMetadata },
}) => {
  const { sidenav } = getTemplate(template);
  const { chapters, guides, publishedBranches, slugToTitle, title, toctree, eol } = useSnootyMetadata();

  const isInPresentationMode = useMemo(() => {
    const forPresentationMode = () => {
      const url = new URL(location.href);
      const path = url.searchParams;
      return path.has(QUERY_PARAM_FOR_DISABLING_ELEMENTS);
    };

    const forPresnetationModeLocalDev = () => {
      const url = new URL(location.href);
      const hash = url.hash;
      const queryParam = `?${QUERY_PARAM_FOR_DISABLING_ELEMENTS}`;
      return hash.includes(queryParam);
    };
    return process.env.GATSBY_SNOOTY_DEV ? forPresnetationModeLocalDev() : forPresentationMode();
  }, [location]);

  const pageTitle = React.useMemo(() => page?.options?.title || slugToTitle?.[slug === '/' ? 'index' : slug], [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  useDelightedSurvey(slug);

  console.log('location', location);

  return (
    <>
      <Global styles={globalCSS} />
      <SiteMetadata siteTitle={title} />
      <RootProvider
        slug={slug}
        repoBranches={repoBranches}
        associatedReposInfo={associatedReposInfo}
        headingNodes={page?.options?.headings}
        selectors={page?.options?.selectors}
        isAssociatedProduct={isAssociatedProduct}
        remoteMetadata={remoteMetadata}
      >
        <GlobalGrid>
          {!isInPresentationMode && (
            <>
              <Header sidenav={sidenav} eol={eol} />
              {sidenav && (
                <Sidenav
                  chapters={chapters}
                  guides={guides}
                  page={page}
                  pageTitle={pageTitle}
                  publishedBranches={publishedBranches}
                  repoBranches={repoBranches}
                  siteTitle={title}
                  slug={slug}
                  toctree={toctree}
                  eol={eol}
                />
              )}
            </>
          )}
          <ContentTransition slug={slug}>{children}</ContentTransition>
        </GlobalGrid>
      </RootProvider>
    </>
  );
};

DefaultLayout.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
    host: PropTypes.string,
    hostname: PropTypes.string,
    href: PropTypes.string,
    key: PropTypes.string,
    origin: PropTypes.string,
    pathname: PropTypes.string,
    port: PropTypes.string,
    protocol: PropTypes.string,
    search: PropTypes.string,
  }),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  pageContext: PropTypes.shape({
    chapters: PropTypes.object,
    guides: PropTypes.object,
    page: PropTypes.shape({
      options: PropTypes.object,
    }).isRequired,
    publishedBranches: PropTypes.object,
    slug: PropTypes.string,
    template: PropTypes.string,
  }).isRequired,
};

export default DefaultLayout;
