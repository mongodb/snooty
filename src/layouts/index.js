import React from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import ContentTransition from '../components/ContentTransition';
import Header from '../components/Header';
import { Sidenav } from '../components/Sidenav';
import SiteMetadata from '../components/site-metadata';
import RootProvider from '../components/RootProvider';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { getTemplate } from '../utils/get-template';
import { useDelightedSurvey } from '../hooks/useDelightedSurvey';

const globalCSS = css`
  html {
    overflow: hidden;
  }

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

  // Originally from docs-tools navbar.css
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
`;

const GlobalGrid = styled('div')`
  display: grid;
  grid-template-areas:
    'header header'
    'sidenav contents';
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

const DefaultLayout = (props) => {
  const { children, pageContext } = props;
  const { project } = useSiteMetadata();
  const {
    metadata: { publishedBranches, slugToTitle, title, toctree },
    page,
    slug,
    template,
  } = pageContext;
  const { sidenav } = getTemplate(project, slug, template);
  const pageTitle = React.useMemo(() => page?.options?.title || slugToTitle[slug === '/' ? 'index' : slug], [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  useDelightedSurvey(slug);

  return (
    <>
      <Global styles={globalCSS} />
      <SiteMetadata siteTitle={title} />
      <RootProvider isSidenavEnabled={sidenav} selectors={page?.options?.selectors}>
        <GlobalGrid>
          <Header sidenav={sidenav} />
          {sidenav && (
            <Sidenav
              page={page}
              pageTitle={pageTitle}
              publishedBranches={publishedBranches}
              siteTitle={title}
              slug={slug}
              toctree={toctree}
            />
          )}
          <ContentTransition slug={slug}>{children}</ContentTransition>
        </GlobalGrid>
      </RootProvider>
    </>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  pageContext: PropTypes.shape({
    page: PropTypes.shape({
      options: PropTypes.object,
    }).isRequired,
    publishedBranches: PropTypes.object,
    slug: PropTypes.string,
    template: PropTypes.string,
  }).isRequired,
};

export default DefaultLayout;
